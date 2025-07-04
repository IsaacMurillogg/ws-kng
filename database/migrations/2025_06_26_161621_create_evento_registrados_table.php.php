<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('evento_registrados', function (Blueprint $table) {
            $table->id();
            $table->integer('unit_id');
            $table->string('unit_name')->nullable();
            $table->timestamp('timestamp');
            $table->string('event_text')->nullable();
            $table->string('event_type')->nullable();
            $table->double('latitud')->nullable();
            $table->double('longitud')->nullable();
            $table->boolean('procesado')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('evento_registrados');
    }
};