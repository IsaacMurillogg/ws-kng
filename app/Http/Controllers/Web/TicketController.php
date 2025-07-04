<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ticket;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $ticketsData = []; // Renombrado para evitar conflicto con el modelo Ticket

        // Determinar qué tickets cargar basado en el rol del usuario
        // Esta lógica es similar a la del Api/TicketController pero adaptada para Inertia
        if ($user->role === 'admin') {
            $ticketsData = Ticket::with('unidad', 'comentarios.user:id,name')
                               ->latest()
                               ->get();
        } else {
            $unidadesUsuarioIds = $user->unidades()->pluck('id');
            if ($unidadesUsuarioIds->isNotEmpty()) {
                $ticketsData = Ticket::whereIn('unidad_id', $unidadesUsuarioIds)
                                   ->with('unidad', 'comentarios.user:id,name')
                                   ->latest()
                                   ->get();
            }
            // Si no es admin y no tiene unidades, $ticketsData permanecerá vacío.
            // El componente React deberá manejar este caso (ej. mostrando un mensaje).
        }

        return Inertia::render('Tickets/Index', [
            'tickets' => $ticketsData,
            'auth' => [ // Información del usuario autenticado para el layout/componentes
                'user' => $user,
                // Podríamos añadir aquí las unidades del usuario si el componente las necesita directamente
                // 'userUnidades' => $user->unidades()->get(['id', 'nombre_unidad']),
            ],
            // Otros props necesarios para la página, como filtros, etc.
        ]);
    }

    public function show(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        $ticket->load('unidad', 'comentarios.user:id,name'); // Cargar relaciones

        // Autorización: similar a Api/TicketController@show
        if (!($user->role === 'admin' || $user->unidades->contains($ticket->unidad_id))) {
            // En un entorno Inertia, usualmente no devuelves JSON sino que rediriges o muestras una página de error.
            // Por simplicidad, podríamos no encontrar el ticket o pasar un flag de error.
            // O mejor, manejar esto con middleware o una policy de Laravel que aborte con 403.
            // Inertia manejará una respuesta 403 mostrando la página de error correspondiente.
            abort(403, 'No autorizado para ver este ticket.');
        }

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
            'auth' => ['user' => $user],
        ]);
    }
}
