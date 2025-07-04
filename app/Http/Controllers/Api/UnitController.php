<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Services\WialonSyncService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class UnitController extends Controller
{
    protected WialonSyncService $wialonSyncService;

    public function __construct(WialonSyncService $wialonSyncService)
    {
        $this->wialonSyncService = $wialonSyncService;
    }

    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $unitsQuery = $user->isAdmin()
                ? Unit::query() 
                : $user->units(); 

            $units = $unitsQuery->orderBy('nombre')->get();

            $mappedUnits = $units->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'name' => $unit->nombre,
                    'plates' => $unit->plates,
                    'telefono' => $unit->telefono,
                    'status' => $unit->status,
                    'speed' => "{$unit->speed} km/h",
                    'last_report_at' => $unit->last_report_at,
                    'location' => $unit->location ?: ($unit->latitude ? "Lat: {$unit->latitude}, Lon: {$unit->longitude}" : 'Ubicación no disponible'),
                    'is_panic_active' => $unit->is_panic_active,
                    // AÑADE ESTAS DOS LÍNEAS PARA ENVIAR LATITUD Y LONGITUD POR SEPARADO
                    'latitude' => $unit->latitude,
                    'longitude' => $unit->longitude,
                ];
            });

            return Inertia::render('Dashboard', [
                'units' => $mappedUnits, 
            ]);

        } catch (Exception $e) {
            Log::error("Error en UnitController@index: " . $e->getMessage());
            return back()->with('error', 'No se pudieron cargar los datos del dashboard.');
        }
    }

    public function syncWialonUnits()
    {
        Log::channel('daily')->info('Petición API recibida para UnitController@syncWialonUnits...');
        try {
            $result = $this->wialonSyncService->syncUnits();
            $statusCode = ($result['failed'] > 0 || (str_contains(strtolower($result['message']), 'error')))
                ? HttpResponse::HTTP_INTERNAL_SERVER_ERROR
                : HttpResponse::HTTP_OK;
            return response()->json($result, $statusCode);
        } catch (Exception $e) {
            Log::channel('daily')->error("Error crítico en UnitController@syncWialonUnits: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Error crítico del servidor.'], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}