<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unidad;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UnidadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Unidad::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre_unidad' => 'required|string|max:255|unique:unidades,nombre_unidad',
        ]);

        $unidad = Unidad::create($validatedData);
        return response()->json($unidad, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Unidad $unidad)
    {
        return $unidad;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Unidad $unidad)
    {
        $validatedData = $request->validate([
            'nombre_unidad' => [
                'required',
                'string',
                'max:255',
                Rule::unique('unidades')->ignore($unidad->id),
            ],
        ]);

        $unidad->update($validatedData);
        return response()->json($unidad);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unidad $unidad)
    {
        $unidad->delete();
        return response()->json(null, 204);
    }
}
