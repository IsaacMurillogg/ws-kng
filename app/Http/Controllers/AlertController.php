<?php

namespace App\Http\Controllers;

use App\Models\EventoRegistrado;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Unit;

class AlertController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $search = $request->input('search');
        $type = $request->input('type');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = EventoRegistrado::query();

        if (!$user->isAdmin()) {
            $assignedWialonUnitIds = $user->units()->pluck('units.id_wialon')->toArray();

            if (empty($assignedWialonUnitIds)) {
                return Inertia::render('Alerts/Index', [
                    'eventos' => EventoRegistrado::whereRaw('FALSE')->paginate(10),
                    'initialSearch' => $search,
                    'initialType' => $type,
                    'initialStartDate' => $startDate,
                    'initialEndDate' => $endDate,
                ]);
            }

            $query->whereIn('unit_id', $assignedWialonUnitIds);
        }

        $query->when($search, function ($q, $search) {
            $q->where(function ($innerQuery) use ($search) {
                $innerQuery->where('unit_name', 'like', '%' . $search . '%')
                           ->orWhere('unit_id', 'like', '%' . $search . '%');
            });
        });

        $query->when($type, function ($q, $type) {
            $q->where('type', $type);
        });

        $query->when($startDate, function ($q, $startDate) {
            $q->whereDate('timestamp', '>=', $startDate);
        });

        $query->when($endDate, function ($q, $endDate) {
            $q->whereDate('timestamp', '<=', $endDate);
        });


        $eventos = $query->orderByDesc('timestamp')
                         ->paginate(10);

        return Inertia::render('Alerts/Index', [
            'eventos' => $eventos,
            'initialSearch' => $search,
            'initialType' => $type,
            'initialStartDate' => $startDate,
            'initialEndDate' => $endDate,
        ]);
    }
}