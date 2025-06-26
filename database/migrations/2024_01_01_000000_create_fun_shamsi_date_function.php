<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateFunShamsiDateFunction extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $sql = "
        CREATE FUNCTION `funShamsiDate`(g_date DATETIME) RETURNS varchar(10) CHARSET utf8mb4
        DETERMINISTIC
        BEGIN
            DECLARE 
                gy INT;
            DECLARE gm INT;
            DECLARE gd INT;
            DECLARE jy INT;
            DECLARE jm INT;
            DECLARE jd INT;
            DECLARE days INT;
            DECLARE i INT;
            DECLARE march_day INT;
            DECLARE is_leap BOOLEAN;
            DECLARE gdm INT;

            -- Get parts of the Gregorian date
            SET gy = YEAR(g_date);
            SET gm = MONTH(g_date);
            SET gd = DAY(g_date);

            -- Check for leap year
            SET is_leap = (gy % 4 = 0 AND gy % 100 != 0) OR (gy % 400 = 0);

            -- Calculate number of days passed since start of Gregorian year
            SET days = gd;
            SET i = 1;

            WHILE i < gm DO
                SET gdm = CASE i
                    WHEN 1 THEN 31
                    WHEN 2 THEN IF(is_leap, 29, 28)
                    WHEN 3 THEN 31
                    WHEN 4 THEN 30
                    WHEN 5 THEN 31
                    WHEN 6 THEN 30
                    WHEN 7 THEN 31
                    WHEN 8 THEN 31
                    WHEN 9 THEN 30
                    WHEN 10 THEN 31
                    WHEN 11 THEN 30
                    WHEN 12 THEN 31
                END;
                SET days = days + gdm;
                SET i = i + 1;
            END WHILE;

            -- Calculate the Persian year and day offset from March 21
            SET march_day = IF(is_leap, 80, 79);

            IF days > march_day THEN
                SET jy = gy - 621;
                SET days = days - march_day;
            ELSE
                SET jy = gy - 622;
                SET days = days + IF(
                    ((gy - 1) % 4 = 0 AND (gy - 1) % 100 != 0) OR ((gy - 1) % 400 = 0),
                    286,
                    285
                );
            END IF;

            -- Convert days into Persian month/day
            IF days <= 186 THEN
                SET jm = FLOOR((days - 1) / 31) + 1;
                SET jd = days - ((jm - 1) * 31);
            ELSE
                SET days = days - 186;
                SET jm = FLOOR((days - 1) / 30) + 7;
                SET jd = days - ((jm - 7) * 30);
            END IF;

            RETURN CONCAT(
                LPAD(jy, 4, '0'), '/', 
                LPAD(jm, 2, '0'), '/', 
                LPAD(jd, 2, '0')
            );
        END
        ";

        DB::unprepared($sql);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP FUNCTION IF EXISTS `funShamsiDate`');
    }
} 