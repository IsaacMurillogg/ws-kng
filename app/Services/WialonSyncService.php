<?php

namespace App\Services;

use App\Models\Unit;
use App\Utils\Wialon\WialonRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class WialonSyncService
{
    private const OFFLINE_THRESHOLD_MINUTES = 15;

    public function syncUnits(): array
    {
        $result = ['created' => 0, 'updated' => 0, 'failed' => 0, 'no_change' => 0, 'message' => ''];

        try {
            $session = $this->attemptApiCall(function() {
                return WialonRequest::login();
            });

            if (empty($session['eid'])) {
                throw new \Exception('Error al iniciar sesión en Wialon: No se obtuvo ID de sesión después de 3 intentos.');
            }

            $wialonUnits = $this->attemptApiCall(function() use ($session) {
                return WialonRequest::getUnitsData($session['eid']);
            });

            if (empty($wialonUnits)) {
                $result['message'] = 'No se encontraron unidades en Wialon para sincronizar.';
                return $result;
            }

            DB::beginTransaction();

            foreach ($wialonUnits as $wialonUnit) {
                try {
                    $wialonId = $wialonUnit['id'] ?? null;
                    if (!$wialonId) {
                        $result['failed']++;
                        continue;
                    }

                    $processedData = $this->processWialonUnitData($wialonUnit);

                    $updatedUnit = Unit::updateOrCreate(['id_wialon' => $wialonId], $processedData);

                    if ($updatedUnit->wasRecentlyCreated) $result['created']++;
                    elseif ($updatedUnit->wasChanged()) $result['updated']++;
                    else $result['no_change']++;

                } catch (Throwable $eUnit) {
                    Log::channel('daily')->error("Error procesando unidad Wialon ID: {$wialonId}", ['error' => $eUnit->getMessage()]);
                    $result['failed']++;
                }
            }

            DB::commit();
            $result['message'] = 'Sincronización completada.';

        } catch (Throwable $e) {
            if (DB::transactionLevel() > 0) DB::rollBack();
            $result['message'] = 'Error GRAVE durante la sincronización: ' . $e->getMessage();
            Log::channel('daily')->critical("Error CRÍTICO en WialonSyncService", ['exception' => $e]);
        }

        return $result;
    }

    private function processWialonUnitData(array $wialonUnit): array
    {
        $lastMessage = $wialonUnit['lmsg'] ?? null;
        $position = $lastMessage['pos'] ?? null;
        $speed = $position['s'] ?? 0;
        $lastReportTimestamp = $lastMessage['t'] ?? 0;
        $lastReportAt = $lastReportTimestamp > 0 ? Carbon::createFromTimestamp($lastReportTimestamp) : null;
        $status = $this->determineStatus($speed, $lastReportAt);

        return [
            'nombre' => $wialonUnit['nombre'],
            'plates' => $wialonUnit['plates'],
            'telefono' => $wialonUnit['telefono'],
            'status' => $status,
            'latitude' => $position['y'] ?? null,
            'longitude' => $position['x'] ?? null,
            'speed' => $speed,
            'last_report_at' => $lastReportAt,
            'raw_data' => $wialonUnit,
        ];
    }

    private function determineStatus(int $speed, ?Carbon $lastReportAt): string
    {
        if ($speed > 0) return 'moving';
        if ($lastReportAt && $lastReportAt->diffInMinutes(now()) <= self::OFFLINE_THRESHOLD_MINUTES) return 'online';
        return 'offline';
    }

    private function attemptApiCall(callable $callback, int $maxAttempts = 3, int $delay = 2): mixed
    {
        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                return $callback();
            } catch (Throwable $e) {
                Log::warning("Intento de llamada a la API #{$attempt}/{$maxAttempts} falló.", [
                    'error' => $e->getMessage()
                ]);

                if ($attempt === $maxAttempts) {
                    throw $e;
                }

                sleep($delay);
            }
        }
        
        throw new \Exception("La llamada a la API falló después de {$maxAttempts} intentos.");
    }
}