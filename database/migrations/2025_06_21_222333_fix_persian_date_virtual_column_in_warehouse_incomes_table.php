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
        // Check if the column exists before trying to drop it
        if (Schema::hasColumn('warehouse_incomes', 'persian_created_date')) {
            Schema::table('warehouse_incomes', function (Blueprint $table) {
                $table->dropColumn('persian_created_date');
            });
        }

        // Create accurate Persian date virtual column using proper conversion algorithm
        DB::statement("
            ALTER TABLE warehouse_incomes 
            ADD COLUMN persian_created_date VARCHAR(255) 
            GENERATED ALWAYS AS (
                CONCAT(
                    -- Persian Year calculation
                    CASE 
                        WHEN DAYOFYEAR(created_at) <= (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) 
                        THEN YEAR(created_at) - 622
                        ELSE YEAR(created_at) - 621
                    END,
                    '/',
                    -- Persian Month and Day calculation
                    CASE 
                        -- Handle Nowruz transition (around March 20-21)
                        WHEN DAYOFYEAR(created_at) <= (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) THEN
                            CONCAT(
                                LPAD(CASE 
                                    WHEN DAYOFYEAR(created_at) <= 31 THEN 10  -- Dey
                                    WHEN DAYOFYEAR(created_at) <= 59 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END THEN 11  -- Bahman
                                    ELSE 12  -- Esfand
                                END, 2, '0'),
                                '/',
                                LPAD(CASE 
                                    WHEN DAYOFYEAR(created_at) <= 31 THEN DAYOFYEAR(created_at)
                                    WHEN DAYOFYEAR(created_at) <= 59 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END THEN DAYOFYEAR(created_at) - 31
                                    ELSE DAYOFYEAR(created_at) - (59 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)
                                END, 2, '0')
                            )
                        ELSE
                            -- Persian year starts from Nowruz
                            CASE 
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 31 THEN
                                    CONCAT('01/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 62 THEN
                                    CONCAT('02/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 31), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 93 THEN
                                    CONCAT('03/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 62), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 124 THEN
                                    CONCAT('04/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 93), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 155 THEN
                                    CONCAT('05/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 124), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 186 THEN
                                    CONCAT('06/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 155), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 216 THEN
                                    CONCAT('07/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 186), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 246 THEN
                                    CONCAT('08/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 216), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 276 THEN
                                    CONCAT('09/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 246), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 306 THEN
                                    CONCAT('10/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 276), 2, '0'))
                                WHEN (DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END)) <= 336 THEN
                                    CONCAT('11/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 306), 2, '0'))
                                ELSE
                                    CONCAT('12/', LPAD((DAYOFYEAR(created_at) - (79 + CASE WHEN ((YEAR(created_at) % 4 = 0 AND YEAR(created_at) % 100 != 0) OR YEAR(created_at) % 400 = 0) THEN 1 ELSE 0 END) - 336), 2, '0'))
                            END
                    END
                )
            ) VIRTUAL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('warehouse_incomes', function (Blueprint $table) {
            $table->dropColumn('persian_created_date');
        });
    }
};
