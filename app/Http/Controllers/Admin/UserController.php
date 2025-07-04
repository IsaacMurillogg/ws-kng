<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Unit;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Muestra la lista de usuarios y las unidades disponibles.
     */
    public function index()
    {
        // Carga los usuarios y las unidades que tienen asignadas
        $users = User::with('units')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'assigned_unit_ids' => $user->units->pluck('id')->toArray(),
            ];
        });

        // Carga todas las unidades para los modales de asignación
        $allUnits = Unit::select('id', 'id_wialon', 'nombre', 'plates')->get();

        // Renderiza la página de Inertia con los datos necesarios
        return Inertia::render('Users/Index', [
            'users' => $users,
            'allUnits' => $allUnits,
        ]);
    }

    /**
     * Guarda un nuevo usuario en la base de datos.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:user,admin',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Usuario creado exitosamente.');
    }

    /**
     * Actualiza un usuario existente.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:user,admin',
        ]);

        $user->fill($validated);

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Elimina un usuario.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado exitosamente.');
    }

    /**
     * Sincroniza las unidades asignadas a un usuario.
     */
    public function syncUnits(Request $request, User $user)
    {
        $validated = $request->validate([
            'unit_ids' => 'nullable|array',
            'unit_ids.*' => 'exists:units,id',
        ]);
        $user->units()->sync($validated['unit_ids'] ?? []);
        return redirect()->route('admin.users.index')->with('success', 'Unidades asignadas/actualizadas correctamente.');
    }
}