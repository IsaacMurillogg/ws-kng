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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('evento_id'); // ID del evento que generó el ticket
            $table->foreignId('unidad_id')->constrained('unidades')->onDelete('cascade'); // FK a la tabla unidades
            $table->string('estado')->default('abierto'); // Estados: abierto, en progreso, resuelto
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
