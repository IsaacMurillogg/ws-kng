<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_wialon')->unique()->comment('ID único de la unidad en Wialon');

            // Datos principales
            $table->string('nombre');
            $table->string('plates')->nullable()->comment('Placas del vehículo');
            $table->string('telefono')->nullable()->comment('Número de SIM del dispositivo GPS');

            // Datos de estado dinámico
            $table->string('status')->default('offline')->comment('moving, online, offline');
            $table->string('location')->nullable()->comment('Dirección legible (de Geocodificación)');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('speed')->default(0);
            $table->timestamp('last_report_at')->nullable()->comment('Fecha y hora del último reporte');

            // Almacenamiento de datos crudos
            $table->json('raw_data')->nullable()->comment('Respuesta JSON completa de Wialon');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
