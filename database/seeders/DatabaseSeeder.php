<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // AdminUserSeeder::class, // Comentado si UserSeeder ya crea el admin
            UserSeeder::class, // Llamar al UserSeeder que acabamos de modificar
            // Aquí puedes añadir otros seeders que necesites, por ejemplo:
            // UnidadSeeder::class, // Para crear algunas unidades de prueba
            // TicketSeeder::class, // Para crear tickets de prueba asociados a unidades y usuarios
        ]);
    }
}
