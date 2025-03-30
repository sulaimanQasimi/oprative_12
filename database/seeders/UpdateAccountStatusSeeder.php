<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Account;

class UpdateAccountStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Update all accounts with NULL or empty status to 'active'
        Account::whereNull('status')->orWhere('status', '')->update(['status' => 'active']);

        // Log the number of accounts updated
        $this->command->info('All accounts have been updated with a status.');
    }
}
