<?php
// routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UnidadController; // Cambiado de UnitController a UnidadController
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\ComentarioController;
use App\Http\Controllers\AuthController; // Importar AuthController

// Rutas públicas para login/registro
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Rutas para Unidades (Protegidas por AdminMiddleware)
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->group(function () {
        Route::apiResource('unidades', UnidadController::class);
        // Si la ruta syncWialonUnits es solo para admins, también iría aquí:
        // Route::post('/unidades/sync', [UnidadController::class, 'syncWialonUnits']);
    });

    // Rutas para Tickets
    Route::apiResource('tickets', TicketController::class);

    // Rutas para Comentarios
    // Listar comentarios de un ticket específico
    Route::get('/tickets/{ticket}/comentarios', [ComentarioController::class, 'index']);
    // Crear un nuevo comentario para un ticket
    Route::post('/tickets/{ticket}/comentarios', [ComentarioController::class, 'store']);

    // Rutas para gestionar un comentario individual (si no se usa apiResource directamente para comentarios)
    Route::get('/comentarios/{comentario}', [ComentarioController::class, 'show']); // Mostrar un comentario específico
    Route::put('/comentarios/{comentario}', [ComentarioController::class, 'update']);
    Route::delete('/comentarios/{comentario}', [ComentarioController::class, 'destroy']);

    // Rutas para gestión de Usuarios y sus Unidades (Solo Admin)
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->group(function () {
        Route::apiResource('users', \App\Http\Controllers\Api\UserController::class)->except(['store']); // 'store' es manejada por /register
        Route::post('/users/{user}/unidades', [\App\Http\Controllers\Api\UserController::class, 'assignUnidad'])->name('api.users.assignUnidad');
        Route::delete('/users/{user}/unidades/{unidad}', [\App\Http\Controllers\Api\UserController::class, 'removeUnidad'])->name('api.users.removeUnidad');
        Route::get('/users/{user}/unidades', [\App\Http\Controllers\Api\UserController::class, 'listUnidades'])->name('api.users.listUnidades');
    });
});

// Limpieza de rutas anteriores no relacionadas con el sistema de tickets si es necesario.
// La ruta GET /units y POST /units/sync fueron reemplazadas o serán integradas en UnidadController.

