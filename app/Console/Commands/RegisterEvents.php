<?php

namespace App\Console\Commands;

use App\Models\Unit;
use App\Services\WialonService;
use App\Models\EventoRegistrado;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class RegisterEvents extends Command
{
    protected $signature = 'wialon:register-events';
    protected $description = 'Consulta eventos de Wialon y los guarda en la BD de forma robusta y optimizada.';

    private const LAST_RUN_TIMESTAMP_KEY = 'wialon:events:last_run_timestamp';

    public function handle(WialonService $wialonService): int
    {
        Log::channel('wialon_process')->info('== INICIO DEL COMANDO wialon:register-events ==');
        $this->info('Iniciando proceso de registro de eventos de Wialon.');

        $stats = ['created' => 0, 'existing' => 0, 'total_from_api' => 0];

        try {
            $unitsToMonitor = Unit::where('monitorear_eventos', true)->get();

            if ($unitsToMonitor->isEmpty()) {
                $this->warn('No se encontraron unidades marcadas para monitoreo. Proceso finalizado.');
                Log::channel('wialon_process')->info('No hay unidades para monitorear. Proceso finalizado.');
                return self::SUCCESS;
            }

            $unitsMap = $unitsToMonitor->keyBy('id_wialon');
            $unitIds = $unitsMap->keys()->all();
            Log::channel('wialon_process')->info("Se consultarán {$unitsToMonitor->count()} unidades.");
            $this->info("{$unitsToMonitor->count()} unidades serán consultadas.");

            $wialonService->login();

            $timeFrom = Cache::get(self::LAST_RUN_TIMESTAMP_KEY, Carbon::now()->subMinutes(15)->timestamp);
            $timeTo = Carbon::now()->timestamp;

            $this->line('Consultando eventos desde: ' . Carbon::createFromTimestamp($timeFrom)->toDateTimeString() . ' hasta ' . Carbon::createFromTimestamp($timeTo)->toDateTimeString());
            
            $eventsByUnit = $wialonService->getRegisteredEvents($unitIds, $timeFrom, $timeTo);

            if (empty($eventsByUnit)) {
                $this->info('No se encontraron eventos nuevos en Wialon en este intervalo.');
                Log::channel('wialon_process')->info('No se encontraron eventos nuevos en la API.');
                Cache::forever(self::LAST_RUN_TIMESTAMP_KEY, $timeTo);
                return self::SUCCESS;
            }

            $this->line('Procesando y filtrando eventos recibidos...');
            $potentialEvents = [];
            foreach ($eventsByUnit as $unitId => $events) {
                foreach ($events as $event) {
                    if (empty($event['t'])) continue;
                    $uniqueKey = $unitId . '-' . $event['t'];
                    $potentialEvents[$uniqueKey] = ['unit_id' => $unitId, 'event' => $event];
                }
            }
            
            $stats['total_from_api'] = count($potentialEvents);
            Log::channel('wialon_process')->info("Se recibieron {$stats['total_from_api']} eventos potenciales desde la API.");
            $this->info("Se encontraron un total de {$stats['total_from_api']} eventos potenciales. Verificando duplicados en la BD...");

            $existingEventsMap = $this->findExistingEvents(array_values($potentialEvents), $timeFrom, $timeTo);

            $eventsToInsert = [];
            $now = now(); 

            foreach ($potentialEvents as $uniqueKey => $data) {
                if (isset($existingEventsMap[$uniqueKey])) continue;
                
                $event = $data['event'];
                $unitId = $data['unit_id'];
                $unitName = $unitsMap->get($unitId)->nombre ?? 'Desconocido';
                
                $originalText = $event['et'] ?? '';
                $params = $event['p'] ?? [];
                $finalText = str_replace(
                    ['%SENSOR_NAME%', '%SENSOR_VALUE_OLD%', '%SENSOR_VALUE%'],
                    [$params['sensor_name'] ?? 'N/A', $params['sensor_value_old'] ?? 'N/A', $params['sensor_value'] ?? 'N/A'],
                    $originalText
                );

                $eventsToInsert[] = [
                    'unit_id' => $unitId,
                    'unit_name' => $unitName,
                    'timestamp' => Carbon::createFromTimestamp($event['t']),
                    'event_text' => $finalText,
                    'event_type' => $event['tp'] ?? 'event',
                    'latitud' => $event['pos']['y'] ?? 0,
                    'longitud' => $event['pos']['x'] ?? 0,
                    'procesado' => false,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if (!empty($eventsToInsert)) {

                EventoRegistrado::insert($eventsToInsert);
                $stats['created'] = count($eventsToInsert);
            }
            $stats['existing'] = $stats['total_from_api'] - $stats['created'];

            $this->info("Sincronización completada. Resultados:");
            $this->line(" -> <fg=green>{$stats['created']} eventos nuevos insertados.</>");
            $this->line(" -> {$stats['existing']} eventos ya existían en la base de datos.");
            Log::channel('wialon_process')->info('Resultados de la ejecución:', $stats);

            Cache::forever(self::LAST_RUN_TIMESTAMP_KEY, $timeTo);

        } catch (Throwable $e) {
            $this->error('Error CRÍTICO durante la ejecución del comando: ' . $e->getMessage());
            Log::channel('wialon_errors')->critical('El comando wialon:register-events falló de forma catastrófica.', [
                'error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine()
            ]);
            return self::FAILURE;
        } finally {
            $this->line('Cerrando sesión de Wialon...');
            $wialonService->logout();
            Log::channel('wialon_process')->info('== FIN DEL COMANDO wialon:register-events ==');
            $this->info('Proceso finalizado.');
        }
        
        return self::SUCCESS;
    }

    private function findExistingEvents(array $potentialEvents, int $timeFrom, int $timeTo): array
    {
        if (empty($potentialEvents)) {
            return [];
        }

        $unitIds = collect($potentialEvents)->pluck('unit_id')->unique()->all();

        $results = EventoRegistrado::query()
            ->whereIn('unit_id', $unitIds)
            ->whereBetween('timestamp', [Carbon::createFromTimestamp($timeFrom), Carbon::createFromTimestamp($timeTo)])
            ->select('unit_id', 'timestamp')
            ->get();

        $existingEventsMap = [];
        foreach ($results as $row) {
            $key = $row->unit_id . '-' . Carbon::parse($row->timestamp)->timestamp;
            $existingEventsMap[$key] = true;
        }   

        return $existingEventsMap;
    }
}