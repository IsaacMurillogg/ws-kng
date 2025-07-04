<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Unit;
use Illuminate\Support\Str; // Para generar datos aleatorios

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        // Unit::create([
        //     'nombre' => 'Unidad KNG-02',
        //     'email' => 'kng02@example.com',
        //     'id_wialon' => 'W'.rand(1000,9999),
        //     'plates' => 'AAA-02-'.Str::random(1),
        //     'telefono' => '+525579468044'
        // ]);
        // Unit::create([
        //     'nombre' => 'Unidad KNG-04',
        //     'email' => 'kng04@example.com',
        //     'id_wialon' => 'W'.rand(1000,9999),
        //     'plates' => 'AAA-04-'.Str::random(1),
        //     'telefono' => '+525513530134'
        // ]);
        //  Unit::create([
        //     'nombre' => 'Unidad KNG-05',
        //     'email' => 'kng05@example.com',
        //     'id_wialon' => 'W'.rand(1000,9999),
        //     'plates' => 'AAA-05-'.Str::random(1),
        //     'telefono' => null // Ejemplo sin teléfono
        // ]);
        // Unit::create([
        //     'nombre' => 'Unidad KNG-06',
        //     'email' => 'kng06@example.com',
        //     'id_wialon' => 'W'.rand(1000,9999),
        //     'plates' => 'AAA-06-'.Str::random(1),
        //     'telefono' => '+525579468048'
        // ]);
        //  Unit::create([
        //     'nombre' => 'Unidad TR 1255',
        //     'email' => 'tr1255@example.com',
        //     'id_wialon' => 'W'.rand(1000,9999),
        //     'plates' => 'TR-1255-X',
        //     'telefono' => '+525579468047'
        // ]);
    }
}
