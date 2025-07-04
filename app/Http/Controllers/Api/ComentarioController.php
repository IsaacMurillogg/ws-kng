<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comentario;
use App\Models\Ticket; // Necesario para encontrar el ticket
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComentarioController extends Controller
{
    /**
     * Display a listing of the resource for a specific ticket.
     * Ruta: GET /tickets/{ticket}/comentarios
     */
    public function index(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        $ticket->load('unidad'); // Cargar la unidad del ticket para la autorización

        // Permitir si el usuario es admin o si el ticket pertenece a una de las unidades del usuario
        if ($user->role === 'admin' || $user->unidades->contains($ticket->unidad_id)) {
            return $ticket->comentarios()->with('user:id,name')->latest()->get();
        }

        return response()->json(['message' => 'No autorizado para ver comentarios de este ticket.'], 403);
    }

    /**
     * Store a newly created resource in storage for a specific ticket.
     * Ruta: POST /tickets/{ticket}/comentarios
     */
    public function store(Request $request, Ticket $ticket)
    {
        $user = $request->user();
        $ticket->load('unidad');

        // Permitir si el usuario es admin o si el ticket pertenece a una de las unidades del usuario
        if (!($user->role === 'admin' || $user->unidades->contains($ticket->unidad_id))) {
            return response()->json(['message' => 'No autorizado para comentar en este ticket.'], 403);
        }

        $validatedData = $request->validate([
            'comentario' => 'required|string',
        ]);

        $comentario = $ticket->comentarios()->create([
            'comentario' => $validatedData['comentario'],
            'user_id' => $user->id, // El ID del usuario autenticado
        ]);

        return response()->json($comentario->load('user:id,name'), 201);
    }

    /**
     * Display the specified resource.
     * Ruta: GET /comentarios/{comentario}
     */
    public function show(Request $request, Comentario $comentario)
    {
        $user = $request->user();
        $comentario->load('user:id,name', 'ticket.unidad'); // Cargar relaciones necesarias

        // Permitir si:
        // 1. El usuario es admin
        // 2. El usuario es el autor del comentario
        // 3. El comentario pertenece a un ticket de una de las unidades del usuario
        if ($user->role === 'admin' ||
            $user->id === $comentario->user_id ||
            ($comentario->ticket && $user->unidades->contains($comentario->ticket->unidad_id))) {
            return $comentario;
        }

        return response()->json(['message' => 'No autorizado para ver este comentario.'], 403);
    }

    /**
     * Update the specified resource in storage.
     * Ruta: PUT /comentarios/{comentario}
     */
    public function update(Request $request, Comentario $comentario)
    {
        $user = $request->user();

        // Autorización: Solo el autor o un admin puede editar.
        if ($user->id !== $comentario->user_id && $user->role !== 'admin') {
            return response()->json(['message' => 'No autorizado para actualizar este comentario.'], 403);
        }

        $validatedData = $request->validate([
            'comentario' => 'required|string',
        ]);

        $comentario->update($validatedData);
        return response()->json($comentario->load('user:id,name'));
    }

    /**
     * Remove the specified resource from storage.
     * Ruta: DELETE /comentarios/{comentario}
     */
    public function destroy(Request $request, Comentario $comentario)
    {
        $user = $request->user();

        // Autorización: Solo el autor o un admin puede eliminar.
        if ($user->id !== $comentario->user_id && $user->role !== 'admin') {
            return response()->json(['message' => 'No autorizado para eliminar este comentario.'], 403);
        }

        $comentario->delete();
        return response()->json(null, 204);
    }
}
