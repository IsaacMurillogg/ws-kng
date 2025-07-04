<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Unidad; // Importar el modelo Unidad
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Para store/update si se maneja password
use Illuminate\Validation\Rule;     // Para validaciones de unicidad

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Asegurarse que un admin no se elimine a sí mismo o al único admin, etc. (lógica adicional)
        // Por ahora, simple eliminación.
        $user->delete();
        return response()->json(null, 204);
    }

    /**
     * Asigna una unidad a un usuario.
     */
    public function assignUnidad(Request $request, User $user)
    {
        $request->validate([
            'unidad_id' => 'required|exists:unidades,id',
        ]);

        $unidadId = $request->input('unidad_id');

        // Evitar duplicados si ya está asignado
        if ($user->unidades()->where('unidad_id', $unidadId)->exists()) {
            return response()->json(['message' => 'El usuario ya está asignado a esta unidad.'], 409); // Conflict
        }

        $user->unidades()->attach($unidadId);

        return response()->json(['message' => 'Unidad asignada correctamente.', 'user' => $user->load('unidades')]);
    }

    /**
     * Desasigna una unidad de un usuario.
     */
    public function removeUnidad(Request $request, User $user, Unidad $unidad) // Route model binding para Unidad
    {
        if (!$user->unidades()->where('unidad_id', $unidad->id)->exists()) {
            return response()->json(['message' => 'El usuario no está asignado a esta unidad.'], 404);
        }

        $user->unidades()->detach($unidad->id);

        return response()->json(['message' => 'Unidad desasignada correctamente.', 'user' => $user->load('unidades')]);
    }

    /**
     * Lista las unidades asignadas a un usuario.
     */
    public function listUnidades(Request $request, User $user)
    {
        return response()->json($user->unidades()->get());
    }
}
