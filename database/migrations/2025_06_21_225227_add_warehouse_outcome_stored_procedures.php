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
        // Create the main procedure for getting warehouse outcomes with filters
        DB::unprepared('
            DROP PROCEDURE IF EXISTS GetWarehouseOutcomes;
        ');
        
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

        // Create procedure for creating warehouse outcomes
        DB::unprepared('
            DROP PROCEDURE IF EXISTS CreateWarehouseOutcome;
        ');
        
        DB::unprepared('
            CREATE PROCEDURE CreateWarehouseOutcome(
                IN p_warehouse_id INT,
                IN p_product_id INT,
                IN p_reference_number VARCHAR(255),
                IN p_quantity DECIMAL(10,3),
                IN p_price DECIMAL(10,2),
                IN p_total DECIMAL(10,2),
                IN p_notes TEXT,
                OUT p_outcome_id INT,
                OUT p_success BOOLEAN,
                OUT p_message VARCHAR(255)
            )
            BEGIN
                DECLARE v_existing_ref_count INT DEFAULT 0;
                DECLARE EXIT HANDLER FOR SQLEXCEPTION
                BEGIN
                    ROLLBACK;
                    SET p_success = FALSE;
                    SET p_message = "Database error occurred while creating outcome record";
                    SET p_outcome_id = 0;
                END;
                
                START TRANSACTION;
                
                -- Validate inputs
                IF p_warehouse_id IS NULL OR p_warehouse_id <= 0 THEN
                    SET p_success = FALSE;
                    SET p_message = "Valid warehouse ID is required";
                    SET p_outcome_id = 0;
                    ROLLBACK;
                ELSEIF p_quantity IS NULL OR p_quantity <= 0 THEN
                    SET p_success = FALSE;
                    SET p_message = "Valid quantity is required";
                    SET p_outcome_id = 0;
                    ROLLBACK;
                ELSEIF p_price IS NULL OR p_price < 0 THEN
                    SET p_success = FALSE;
                    SET p_message = "Valid price is required";
                    SET p_outcome_id = 0;
                    ROLLBACK;
                ELSE
                    -- Check for duplicate reference number
                    SELECT COUNT(*) INTO v_existing_ref_count
                    FROM warehouse_outcomes
                    WHERE warehouse_id = p_warehouse_id 
                    AND reference_number = p_reference_number;
                    
                    IF v_existing_ref_count > 0 THEN
                        SET p_success = FALSE;
                        SET p_message = "Reference number already exists for this warehouse";
                        SET p_outcome_id = 0;
                        ROLLBACK;
                    ELSE
                        -- Insert the outcome record
                        INSERT INTO warehouse_outcomes (
                            warehouse_id,
                            product_id,
                            reference_number,
                            quantity,
                            price,
                            total,
                            notes,
                            created_at,
                            updated_at
                        ) VALUES (
                            p_warehouse_id,
                            p_product_id,
                            p_reference_number,
                            p_quantity,
                            p_price,
                            COALESCE(p_total, p_quantity * p_price),
                            p_notes,
                            NOW(),
                            NOW()
                        );
                        
                        SET p_outcome_id = LAST_INSERT_ID();
                        SET p_success = TRUE;
                        SET p_message = "Outcome record created successfully";
                        
                        COMMIT;
                    END IF;
                END IF;
                
            END
        ');

        // Create procedure for outcome statistics
        DB::unprepared('
            DROP PROCEDURE IF EXISTS GetOutcomeStatistics;
        ');
        
        DB::unprepared('
            CREATE PROCEDURE GetOutcomeStatistics(
                IN p_warehouse_id INT,
                IN p_start_date DATE,
                IN p_end_date DATE
            )
            BEGIN
                SELECT 
                    COUNT(*) as total_records,
                    SUM(quantity) as total_quantity,
                    SUM(total) as total_amount,
                    AVG(price) as average_price,
                    MIN(created_at) as first_outcome_date,
                    MAX(created_at) as last_outcome_date,
                    COUNT(DISTINCT product_id) as unique_products
                FROM warehouse_outcomes
                WHERE warehouse_id = p_warehouse_id
                AND (p_start_date IS NULL OR DATE(created_at) >= p_start_date)
                AND (p_end_date IS NULL OR DATE(created_at) <= p_end_date);
                
            END
        ');

        // Create recommended indexes for optimal performance
        try {
            DB::statement('CREATE INDEX idx_warehouse_outcomes_warehouse_id ON warehouse_outcomes(warehouse_id)');
        } catch (\Exception $e) {
            // Index may already exist
        }
        
        try {
            DB::statement('CREATE INDEX idx_warehouse_outcomes_created_at ON warehouse_outcomes(created_at)');
        } catch (\Exception $e) {
            // Index may already exist
        }
        
        try {
            DB::statement('CREATE INDEX idx_warehouse_outcomes_reference ON warehouse_outcomes(reference_number)');
        } catch (\Exception $e) {
            // Index may already exist
        }
        
        try {
            DB::statement('CREATE INDEX idx_warehouse_outcomes_product_id ON warehouse_outcomes(product_id)');
        } catch (\Exception $e) {
            // Index may already exist
        }

        // Create composite indexes for common query patterns
        try {
            DB::statement('CREATE INDEX idx_warehouse_outcomes_composite ON warehouse_outcomes(warehouse_id, created_at, reference_number)');
        } catch (\Exception $e) {
            // Index may already exist
        }
        
        try {
            DB::statement('CREATE INDEX idx_warehouse_outcomes_search ON warehouse_outcomes(warehouse_id, reference_number, notes(100))');
        } catch (\Exception $e) {
            // Index may already exist
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop all stored procedures
        DB::unprepared('DROP PROCEDURE IF EXISTS GetWarehouseOutcomes');
        DB::unprepared('DROP PROCEDURE IF EXISTS CreateWarehouseOutcome');
        DB::unprepared('DROP PROCEDURE IF EXISTS GetOutcomeStatistics');

        // Drop indexes
        DB::statement('DROP INDEX IF EXISTS idx_warehouse_outcomes_warehouse_id');
        DB::statement('DROP INDEX IF EXISTS idx_warehouse_outcomes_created_at');
        DB::statement('DROP INDEX IF EXISTS idx_warehouse_outcomes_reference');
        DB::statement('DROP INDEX IF EXISTS idx_warehouse_outcomes_product_id');
        DB::statement('DROP INDEX IF EXISTS idx_warehouse_outcomes_composite');
        DB::statement('DROP INDEX IF EXISTS idx_warehouse_outcomes_search');
    }
};
