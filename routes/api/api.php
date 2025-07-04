<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UnitController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/units', [UnitController::class, 'index']);
    Route::post('/units/sync', [UnitController::class, 'syncWialonUnits']);

});

