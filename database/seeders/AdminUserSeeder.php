<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        // Define una contraseña estándar para todos los usuarios.
        $password = Hash::make('kng2025*.+');

        // Array con la información de los usuarios a crear.
        $users = [
            [
                'name' => 'Admin KNG',
                'email' => 'master@kng.com',
                'role' => 'admin',
            ],
            [
                'name' => 'Jara Robles Jose Angel',
                'email' => 'jangel@kng.com',
                'role' => 'user',
            ],
            [
                'name' => 'Ramirez Muñiz Norberto Miguel',
                'email' => 'nmigel@kng.com',
                'role' => 'user',
            ],
            [
                'name' => 'Huerta Catellanos Luis Arturo',
                'email' => 'cluis@kng.com',
                'role' => 'user',
            ],
            [
                'name' => 'Ruvalcaba Mercado José',
                'email' => 'mjose@kng.com',
                'role' => 'user',
            ],
            [
                'name' => 'Dominguez Vazquez Efren',
                'email' => 'vefren@kng.com',
                'role' => 'user',
            ],
            [
                'name' => 'Mendez Montes Cesar Ali',
                'email' => 'mcesar@kng.com',
                'role' => 'user',
            ],
            [
                'name' => 'Delgado Sanchez Rafael',
                'email' => 'srafael@kng.com',
                'role' => 'user',
            ],
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'role' => $userData['role'],
                'password' => $password,
                'email_verified_at' => now(), 
            ]);
        }
    }
}
