<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Unidad; // Necesario para validación de unidad_id
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'admin') {
            return Ticket::with('unidad', 'comentarios.user:id,name')->latest()->get();
        }

        // Usuario no admin: solo tickets de sus unidades
        $unidadesUsuarioIds = $user->unidades()->pluck('id');
        if ($unidadesUsuarioIds->isEmpty()) {
            return response()->json(['message' => 'No tiene unidades asignadas.'], 403);
        }
        return Ticket::whereIn('unidad_id', $unidadesUsuarioIds)
                        ->with('unidad', 'comentarios.user:id,name')
                        ->latest()
                        ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Solo Admin puede crear tickets directamente a través de esta API.
        // La creación por "sistema de alertas" sería otra ruta/mecanismo.
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'No autorizado para crear tickets.'], 403);
        }

        $validatedData = $request->validate([
            'evento_id' => 'required|string|max:255',
            'unidad_id' => 'required|exists:unidades,id', // El admin asigna la unidad
            'estado' => ['sometimes', 'string', Rule::in(['abierto', 'en progreso', 'resuelto'])],
        ]);

        $ticket = Ticket::create($validatedData);
        return response()->json($ticket->load('unidad'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        $ticket->load('unidad', 'comentarios.user:id,name');

        if ($user->role === 'admin' || $user->unidades->contains($ticket->unidad_id)) {
            return $ticket;
        }

        return response()->json(['message' => 'No autorizado para ver este ticket.'], 403);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            // Admin puede cambiar la unidad_id, usuario normal no.
            'unidad_id' => [Rule::requiredIf($user->role === 'admin'), 'exists:unidades,id'],
            'estado' => ['sometimes', 'required', 'string', Rule::in(['abierto', 'en progreso', 'resuelto'])],
        ]);

        if ($user->role === 'admin') {
            $ticket->update($validatedData);
        } elseif ($user->unidades->contains($ticket->unidad_id)) {
            // Usuario no admin solo puede actualizar el estado del ticket de su unidad.
            if (isset($validatedData['unidad_id']) && $validatedData['unidad_id'] != $ticket->unidad_id) {
                return response()->json(['message' => 'No autorizado para cambiar la unidad del ticket.'], 403);
            }
            $ticket->update(['estado' => $validatedData['estado'] ?? $ticket->estado]);
        } else {
            return response()->json(['message' => 'No autorizado para actualizar este ticket.'], 403);
        }

        return response()->json($ticket->load('unidad', 'comentarios.user:id,name'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        // Solo admin puede eliminar
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'No autorizado para eliminar tickets.'], 403);
        }

        $ticket->delete();
        return response()->json(null, 204);
    }
}
