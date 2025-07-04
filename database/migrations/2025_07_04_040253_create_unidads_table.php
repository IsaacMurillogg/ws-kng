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
        Schema::create('unidades', function (Blueprint $table) { // Nombre de tabla cambiado a 'unidades' (plural español)
            $table->id();
            $table->string('nombre_unidad')->unique(); // Añadido campo nombre_unidad, único
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unidades'); // Nombre de tabla cambiado a 'unidades'
    }
};
