<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Api\UnitController;
use App\Http\Controllers\AlertController; 
use Inertia\Inertia;
use App\Models\EventoRegistrado;


Route::get('/', function () {
    return redirect()->route('login');
});

// Ruta de dashboard: ¡Implementando redirección para administradores!
Route::get('/dashboard', [UnitController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/units', [UserController::class, 'syncUnits'])->name('users.sync_units');
});

Route::middleware(['auth', 'admin'])->prefix('api')->name('api.')->group(function () {
    Route::put('/units/{unit}', [UnitController::class, 'updateUnit'])->name('units.update');
    Route::delete('/units/{unit}', [UnitController::class, 'destroyUnit'])->name('units.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/alertas', [AlertController::class, 'index'])->name('alerts.index');

    // Rutas para Tickets (Web/Inertia)
    Route::get('/tickets', [\App\Http\Controllers\Web\TicketController::class, 'index'])
        ->name('tickets.index');
    Route::get('/tickets/{ticket}', [\App\Http\Controllers\Web\TicketController::class, 'show'])
        ->name('tickets.show');
    // Aquí podrían ir rutas para crear/editar tickets si se hace con páginas completas Inertia,
    // o se pueden manejar con modales/componentes dentro de Index o Show que llamen a la API.
});

// Las rutas de administración de unidades podrían ir dentro del grupo admin existente si se adaptan
// o en un nuevo grupo si se manejan con un controlador Web/UnidadController diferente.
// Por ahora, las rutas de API para unidades ya están protegidas por AdminMiddleware.
// Si se necesita una vista Inertia para la gestión de unidades:
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // ... rutas de admin existentes ...
    Route::get('/unidades-gestion', [\App\Http\Controllers\Web\UnidadController::class, 'index']) // Ejemplo de ruta para admin
         ->name('unidades.gestion.index');
});

require __DIR__.'/auth.php';
