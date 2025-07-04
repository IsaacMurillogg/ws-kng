<?php

namespace App\Utils\Wialon;

use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class WialonRequest
{
    public static function login(): ?array
    {
        $token = config('services.wialon.token');
        $baseUrl = config('services.wialon.base_url');

        if (!$token) {
            Log::channel('daily')->critical('CRÍTICO: Wialon Token no está configurado en el archivo .env.');
            throw new Exception('Wialon Token no configurado.');
        }

        try {
            $response = Http::asForm()->post($baseUrl . '/wialon/ajax.html', [
                'svc' => 'token/login', 'params' => json_encode(['token' => $token])
            ]);

            $responseData = $response->json();

            if (!$response->successful()) {
                Log::channel('daily')->error('Error HTTP en Login Wialon', ['status' => $response->status(), 'body' => $response->body()]);
                throw new Exception("Error HTTP {$response->status()} al iniciar sesión en Wialon.");
            }

            if (isset($responseData['error'])) {
                 Log::channel('daily')->error('Error de API en Login Wialon', ['code' => $responseData['error'], 'reason' => $responseData['reason'] ?? 'N/A']);
                throw new Exception("Fallo al iniciar sesión en Wialon: " . ($responseData['reason'] ?? "Error código {$responseData['error']}"));
            }

            if (!empty($responseData['eid'])) {
                Log::channel('daily')->info('Login en Wialon exitoso. Session ID (eid) obtenido.');
                return ['eid' => $responseData['eid'], 'user' => (object) ($responseData['user'] ?? [])];
            }

            throw new Exception('Login en Wialon exitoso, pero no se obtuvo session ID.');

        } catch (Throwable $ex) {
            Log::channel('daily')->critical('Excepción CRÍTICA durante login Wialon.', ['error' => $ex->getMessage()]);
            throw $ex;
        }
    }

    public static function getUnitsData(string $sessionId): array
    {
        $baseUrl = config('services.wialon.base_url');

        $flags = 4294967295;

        $paramsForWialon = [
            "spec" => [ "itemsType" => "avl_unit", "propName" => "sys_name", "propValueMask" => "*", "sortType" => "sys_name" ],
            "force" => 1,
            "flags" => $flags,
            "from" => 0,
            "to" => 0
        ];

        try {
            $urlWithJsonFlag = $baseUrl . '/wialon/ajax.html?flags=1024';

            $response = Http::asForm()->post($urlWithJsonFlag, [
                'svc' => 'core/search_items', 'params' => json_encode($paramsForWialon), 'sid' => $sessionId
            ]);

            if (!$response->successful()) {
                Log::channel('daily')->error('Error HTTP al obtener unidades', ['status' => $response->status(), 'body' => $response->body()]);
                throw new Exception("Error HTTP {$response->status()} al obtener datos de unidades.");
            }

            $wialonResponseData = $response->json();
            if ($wialonResponseData === null) {
                Log::channel('daily')->error('La respuesta de Wialon no es un JSON válido.', ['body' => $response->body()]);
                throw new Exception('La respuesta de Wialon no es un JSON válido.');
            }

            if (isset($wialonResponseData['error'])) {
                Log::channel('daily')->error('Error de API Wialon al obtener unidades', ['code' => $wialonResponseData['error'], 'reason' => $wialonResponseData['reason'] ?? 'N/A']);
                throw new Exception('Error de API Wialon al obtener unidades.');
            }

            $wialonItems = $wialonResponseData['items'] ?? [];
            Log::channel('daily')->info("Se obtuvieron " . count($wialonItems) . " unidades desde Wialon.");
            if (empty($wialonItems)) { return []; }

            $units = [];
            foreach ($wialonItems as $item) {
                if (!isset($item['id'], $item['nm'])) continue;

                $plates = null;

                if (isset($item['pflds']) && is_array($item['pflds'])) {
                    foreach ($item['pflds'] as $profileField) {
                        if (is_array($profileField) && isset($profileField['n'], $profileField['v']) && $profileField['n'] === 'registration_plate') {
                            $plates = trim($profileField['v']);
                            break;
                        }
                    }
                }
                if ($plates === null && isset($item['cfl']) && !empty(trim($item['cfl']))) {
                    $plates = trim($item['cfl']);
                }
                if ($plates === null && isset($item['flds']) && is_array($item['flds'])) {
                    foreach ($item['flds'] as $customField) {
                        if (is_array($customField) && isset($customField['n'], $customField['v']) && strcasecmp(trim($customField['n']), 'registration_plate') === 0) {
                            $plates = trim($customField['v']);
                            break;
                        }
                    }
                }

                $units[] = [
                    'id' => $item['id'],
                    'nombre' => $item['nm'],
                    'plates' => $plates,
                    'telefono' => $item['ph'] ?? $item['ph2'] ?? null,
                    'lmsg' => $item['lmsg'] ?? null,
                    'raw_data' => $item,
                ];
            }
            return $units;

        } catch (Throwable $ex) {
            Log::channel('daily')->critical('Excepción CRÍTICA al obtener datos de unidades.', ['error' => $ex->getMessage()]);
            throw $ex;
        }
    }
}
