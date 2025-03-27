<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create or get admin user
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@mod.af'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('123'),
            ]
        );

        $this->call(CurrencySeeder::class);
        $this->call(CustomerPermissionSeeder::class);
    }
}
