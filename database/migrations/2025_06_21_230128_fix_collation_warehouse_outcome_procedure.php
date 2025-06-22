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
        // Drop the existing procedure
        DB::unprepared('DROP PROCEDURE IF EXISTS GetWarehouseOutcomes');
        
        // Recreate with collation fixes
        DB::unprepared('
            CREATE PROCEDURE GetWarehouseOutcomes(
                IN p_warehouse_id INT,
                IN p_search VARCHAR(255),
                IN p_year INT,
                IN p_month INT,
                IN p_day INT,
                IN p_sort_by VARCHAR(50),
                IN p_sort_direction VARCHAR(4),
                IN p_page INT,
                IN p_per_page INT,
                OUT p_total_records INT
            )
            BEGIN
                DECLARE v_offset INT DEFAULT 0;
                DECLARE v_valid_sort_by VARCHAR(50) DEFAULT "created_at";
                DECLARE v_valid_direction VARCHAR(4) DEFAULT "desc";
                
                -- Validate and set defaults
                SET p_page = IFNULL(p_page, 1);
                SET p_per_page = IFNULL(p_per_page, 10);
                SET v_offset = (p_page - 1) * p_per_page;
                
                -- Validate sort column
                IF p_sort_by IN ("created_at", "reference_number", "total", "quantity", "price") THEN
                    SET v_valid_sort_by = p_sort_by;
                END IF;
                
                -- Validate sort direction
                IF p_sort_direction IN ("asc", "desc") THEN
                    SET v_valid_direction = p_sort_direction;
                END IF;
                
                -- Get total count for pagination with collation fixes
                SELECT COUNT(*) INTO p_total_records
                FROM warehouse_outcomes wo
                LEFT JOIN products p ON wo.product_id = p.id
                WHERE wo.warehouse_id = p_warehouse_id
                AND (p_search IS NULL OR p_search = "" OR 
                     wo.reference_number COLLATE utf8mb4_unicode_ci LIKE CONCAT("%", p_search COLLATE utf8mb4_unicode_ci, "%") OR
                     wo.notes COLLATE utf8mb4_unicode_ci LIKE CONCAT("%", p_search COLLATE utf8mb4_unicode_ci, "%") OR
                     p.name COLLATE utf8mb4_unicode_ci LIKE CONCAT("%", p_search COLLATE utf8mb4_unicode_ci, "%"))
                AND (p_year IS NULL OR YEAR(wo.created_at) = p_year)
                AND (p_month IS NULL OR p_year IS NULL OR MONTH(wo.created_at) = p_month)
                AND (p_day IS NULL OR p_month IS NULL OR p_year IS NULL OR DAY(wo.created_at) = p_day);
                
                -- Get paginated results with collation fixes and dynamic sorting
                SET @sql = CONCAT(
                    "SELECT 
                        wo.id,
                        wo.reference_number,
                        wo.total,
                        wo.quantity,
                        wo.price,
                        DATE(wo.created_at) as outcome_date,
                        COALESCE(p.name, \\"Unknown\\") as destination,
                        wo.notes,
                        wo.created_at,
                        wo.updated_at
                    FROM warehouse_outcomes wo
                    LEFT JOIN products p ON wo.product_id = p.id
                    WHERE wo.warehouse_id = ", p_warehouse_id
                );
                
                -- Add search conditions with collation fixes
                IF p_search IS NOT NULL AND p_search != "" THEN
                    SET @sql = CONCAT(@sql, 
                        " AND (wo.reference_number COLLATE utf8mb4_unicode_ci LIKE CONCAT(\\"%\\", \\"", p_search, "\\", \\"%\\") OR ",
                        "wo.notes COLLATE utf8mb4_unicode_ci LIKE CONCAT(\\"%\\", \\"", p_search, "\\", \\"%\\") OR ",
                        "p.name COLLATE utf8mb4_unicode_ci LIKE CONCAT(\\"%\\", \\"", p_search, "\\", \\"%\\"))"
                    );
                END IF;
                
                -- Add date filters
                IF p_year IS NOT NULL THEN
                    SET @sql = CONCAT(@sql, " AND YEAR(wo.created_at) = ", p_year);
                END IF;
                
                IF p_month IS NOT NULL AND p_year IS NOT NULL THEN
                    SET @sql = CONCAT(@sql, " AND MONTH(wo.created_at) = ", p_month);
                END IF;
                
                IF p_day IS NOT NULL AND p_month IS NOT NULL AND p_year IS NOT NULL THEN
                    SET @sql = CONCAT(@sql, " AND DAY(wo.created_at) = ", p_day);
                END IF;
                
                -- Add sorting and pagination
                SET @sql = CONCAT(@sql, 
                    " ORDER BY wo.", v_valid_sort_by, " ", v_valid_direction,
                    " LIMIT ", p_per_page, " OFFSET ", v_offset
                );
                
                PREPARE stmt FROM @sql;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
                
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the fixed procedure
        DB::unprepared('DROP PROCEDURE IF EXISTS GetWarehouseOutcomes');
        
        // Recreate the original procedure (without collation fixes)
        DB::unprepared('
            CREATE PROCEDURE GetWarehouseOutcomes(
                IN p_warehouse_id INT,
                IN p_search VARCHAR(255),
                IN p_year INT,
                IN p_month INT,
                IN p_day INT,
                IN p_sort_by VARCHAR(50),
                IN p_sort_direction VARCHAR(4),
                IN p_page INT,
                IN p_per_page INT,
                OUT p_total_records INT
            )
            BEGIN
                DECLARE v_offset INT DEFAULT 0;
                DECLARE v_valid_sort_by VARCHAR(50) DEFAULT "created_at";
                DECLARE v_valid_direction VARCHAR(4) DEFAULT "desc";
                
                -- Validate and set defaults
                SET p_page = IFNULL(p_page, 1);
                SET p_per_page = IFNULL(p_per_page, 10);
                SET v_offset = (p_page - 1) * p_per_page;
                
                -- Validate sort column
                IF p_sort_by IN ("created_at", "reference_number", "total", "quantity", "price") THEN
                    SET v_valid_sort_by = p_sort_by;
                END IF;
                
                -- Validate sort direction
                IF p_sort_direction IN ("asc", "desc") THEN
                    SET v_valid_direction = p_sort_direction;
                END IF;
                
                -- Get total count for pagination
                SELECT COUNT(*) INTO p_total_records
                FROM warehouse_outcomes wo
                LEFT JOIN products p ON wo.product_id = p.id
                WHERE wo.warehouse_id = p_warehouse_id
                AND (p_search IS NULL OR p_search = "" OR 
                     wo.reference_number LIKE CONCAT("%", p_search, "%") OR
                     wo.notes LIKE CONCAT("%", p_search, "%") OR
                     p.name LIKE CONCAT("%", p_search, "%"))
                AND (p_year IS NULL OR YEAR(wo.created_at) = p_year)
                AND (p_month IS NULL OR p_year IS NULL OR MONTH(wo.created_at) = p_month)
                AND (p_day IS NULL OR p_month IS NULL OR p_year IS NULL OR DAY(wo.created_at) = p_day);
                
                -- Get paginated results with dynamic sorting
                SET @sql = CONCAT(
                    "SELECT 
                        wo.id,
                        wo.reference_number,
                        wo.total,
                        wo.quantity,
                        wo.price,
                        DATE(wo.created_at) as outcome_date,
                        COALESCE(p.name, \\"Unknown\\") as destination,
                        wo.notes,
                        wo.created_at,
                        wo.updated_at
                    FROM warehouse_outcomes wo
                    LEFT JOIN products p ON wo.product_id = p.id
                    WHERE wo.warehouse_id = ", p_warehouse_id
                );
                
                -- Add search conditions
                IF p_search IS NOT NULL AND p_search != "" THEN
                    SET @sql = CONCAT(@sql, 
                        " AND (wo.reference_number LIKE \\"%", p_search, "%\\" OR ",
                        "wo.notes LIKE \\"%", p_search, "%\\" OR ",
                        "p.name LIKE \\"%", p_search, "%\\")"
                    );
                END IF;
                
                -- Add date filters
                IF p_year IS NOT NULL THEN
                    SET @sql = CONCAT(@sql, " AND YEAR(wo.created_at) = ", p_year);
                END IF;
                
                IF p_month IS NOT NULL AND p_year IS NOT NULL THEN
                    SET @sql = CONCAT(@sql, " AND MONTH(wo.created_at) = ", p_month);
                END IF;
                
                IF p_day IS NOT NULL AND p_month IS NOT NULL AND p_year IS NOT NULL THEN
                    SET @sql = CONCAT(@sql, " AND DAY(wo.created_at) = ", p_day);
                END IF;
                
                -- Add sorting and pagination
                SET @sql = CONCAT(@sql, 
                    " ORDER BY wo.", v_valid_sort_by, " ", v_valid_direction,
                    " LIMIT ", p_per_page, " OFFSET ", v_offset
                );
                
                PREPARE stmt FROM @sql;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
                
            END
        ');
    }
};
