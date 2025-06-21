<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, clean up duplicate data
        DB::statement('
            DELETE g1 FROM gates g1
            INNER JOIN gates g2
            WHERE g1.id < g2.id
            AND (g1.name = g2.name OR g1.user_id = g2.user_id)
        ');

        // Update remaining gates to have unique names if needed
        $duplicateNames = DB::select('
            SELECT name, COUNT(*) as count
            FROM gates
            GROUP BY name
            HAVING COUNT(*) > 1
        ');

        foreach ($duplicateNames as $duplicate) {
            $gates = DB::select('SELECT id FROM gates WHERE name = ? ORDER BY id', [$duplicate->name]);
            foreach ($gates as $index => $gate) {
                if ($index > 0) {
                    DB::update('UPDATE gates SET name = ? WHERE id = ?', [
                        $duplicate->name . '_' . ($index + 1),
                        $gate->id
                    ]);
                }
            }
        }

        // Add unique constraint for user_id (name constraint already exists)
        Schema::table('gates', function (Blueprint $table) {
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gates', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
        });
    }
};
