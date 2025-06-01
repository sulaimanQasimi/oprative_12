<?php

namespace Database\Seeders;

use App\Models\Employee;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 10 dummy employees with no fingerprints
        Employee::factory()->count(10)->create();
        
        $this->command->info('Created 10 dummy employees successfully.');
    }
}
