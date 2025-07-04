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
        Schema::create('user_unidad', function (Blueprint $table) { // Renombrar tabla a user_unidad por claridad
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Referencia explícita a tabla users
            $table->foreignId('unidad_id')->constrained('unidades')->onDelete('cascade'); // Referencia explícita a tabla unidades
            $table->primary(['user_id', 'unidad_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_unidad'); // Asegurarse que el down coincida con el nuevo nombre
    }
};