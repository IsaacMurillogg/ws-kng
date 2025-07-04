<?php

namespace App\Utils\Wialon;

use Exception;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class WialonEventRequest
{
    private const RETRY_TIMES = 3;
    private const RETRY_DELAY_MS = 1000; // Milisegundos

    // ***** NUEVAS CONSTANTES PARA EL CONTROL DE CONCURRENCIA *****
    private const UNIT_CHUNK_SIZE = 10; // Número de unidades a procesar concurrentemente en cada lote
    private const DELAY_BETWEEN_CHUNKS_SECONDS = 1; // Retraso en segundos entre cada lote de peticiones
    // **************************************************************

    private static function httpClient(): PendingRequest
    {
        // El método retry aquí es para fallos de conexión o timeouts de la petición individual.
        // El error 1003 (LIMIT api_concurrent) se maneja con la lógica de chunking.
        return Http::retry(self::RETRY_TIMES, self::RETRY_DELAY_MS)->asForm()->acceptJson();
    }

    public static function login(): string
    {
        $token = config('services.wialon.token');
        $baseUrl = config('services.wialon.base_url');

        if (!$token) {
            throw new Exception('CRÍTICO: El token de Wialon (WIALON_TOKEN) no está configurado.');
        }
        try {
            Log::channel('wialon_process')->info('Intentando iniciar sesión en Wialon.');
            $response = self::httpClient()->post($baseUrl . '/wialon/ajax.html', [
                'svc' => 'token/login', 'params' => json_encode(['token' => $token]),
            ]);
            $response->throw(); 
            $data = $response->json();
            if (isset($data['error'])) {
                throw new Exception("Fallo en el login de Wialon: " . ($data['reason'] ?? "Error código {$data['error']}"));
            }
            if (empty($data['eid'])) {
                throw new Exception('Login en Wialon exitoso, pero no se obtuvo session ID (eid).');
            }
            Log::channel('wialon_process')->info('Login en Wialon exitoso. Session ID obtenido.');
            return $data['eid'];
        } catch (Throwable $e) {
            Log::channel('wialon_errors')->critical('Excepción CRÍTICA durante el login en Wialon.', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public static function getRegisteredEvents(string $sessionId, array $unitIds, int $timeFrom, int $timeTo): array
    {
        $baseUrl = config('services.wialon.base_url');
        $eventsByUnit = [];

        $unitIdChunks = array_chunk($unitIds, self::UNIT_CHUNK_SIZE);
        $totalChunks = count($unitIdChunks);

        Log::channel('wialon_process')->info("Procesando eventos para " . count($unitIds) . " unidades en {$totalChunks} lotes de " . self::UNIT_CHUNK_SIZE . ".");

        foreach ($unitIdChunks as $index => $unitIdChunk) {
            Log::channel('wialon_process')->info("Procesando lote " . ($index + 1) . " de {$totalChunks} con " . count($unitIdChunk) . " unidades.");
            try {
                $responses = Http::pool(function (Pool $pool) use ($baseUrl, $sessionId, $unitIdChunk, $timeFrom, $timeTo) {
                    foreach ($unitIdChunk as $unitId) {
                        $payload = [
                            'svc' => 'messages/load_interval',
                            'params' => json_encode([
                                'itemId' => $unitId, 'timeFrom' => $timeFrom, 'timeTo' => $timeTo,
                                'flags' => 1536, 'flagsMask' => 65280, 'loadCount' => 9999
                            ]),
                            'sid' => $sessionId,
                        ];
                        $pool->as('unit-' . $unitId)->asForm()->post($baseUrl . '/wialon/ajax.html', $payload);
                    }
                });

                foreach ($responses as $key => $response) {
                    $unitId = str_replace('unit-', '', $key);

                    if ($response->failed()) {
                        Log::channel('wialon_errors')->error('No se pudieron obtener eventos para una unidad (fallo HTTP).', [
                            'unit_id' => $unitId, 'status' => $response->status(), 'error' => $response->body()
                        ]);
                        continue;
                    }

                    $data = $response->json();
                    if (isset($data['error'])) {
                        Log::channel('wialon_errors')->warning('API de Wialon devolvió un error para una unidad.', [
                            'unit_id' => $unitId, 'error_code' => $data['error'], 'reason' => $data['reason'] ?? 'N/A'
                        ]);
                        continue;
                    }

                    if (!empty($data['messages'])) {
                        $eventsByUnit[$unitId] = $data['messages'];
                    }
                }

                if ($index < $totalChunks - 1) {
                    Log::channel('wialon_process')->info("Esperando " . self::DELAY_BETWEEN_CHUNKS_SECONDS . " segundos antes del siguiente lote.");
                    sleep(self::DELAY_BETWEEN_CHUNKS_SECONDS);
                }

            } catch (Throwable $e) {
                Log::channel('wialon_errors')->critical('Fallo crítico al ejecutar el pool de peticiones a Wialon para el lote.', [
                    'exception' => $e->getMessage(),
                    'unit_ids_in_chunk' => $unitIdChunk 
                ]);
            }
        }
        
        return $eventsByUnit;
    }

    public static function logout(string $sessionId): void
    {
        $baseUrl = config('services.wialon.base_url');
        try {
            Http::asForm()->post($baseUrl . '/wialon/ajax.html', [
                'svc' => 'core/logout', 'params' => '{}', 'sid' => $sessionId,
            ]);
            Log::channel('wialon_process')->info('Sesión de Wialon cerrada correctamente.');
        } catch (Throwable $e) {
            Log::channel('wialon_errors')->warning('Fallo al intentar cerrar la sesión de Wialon (no es crítico).', [
                'sid' => $sessionId, 'error' => $e->getMessage()
            ]);
        }
    }
}