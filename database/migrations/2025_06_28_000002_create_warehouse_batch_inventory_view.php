<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE VIEW warehouse_batch_inventory AS
            SELECT 
                b.id as batch_id,
                b.product_id,
                b.reference_number as batch_reference,
                b.issue_date,
                b.expire_date,
                b.notes as batch_notes,
                p.name as product_name,
                p.barcode as product_barcode,
                w.id as warehouse_id,
                w.name as warehouse_name,
                COALESCE(wi.income_qty, 0) as income_qty,
                COALESCE(wo.outcome_qty, 0) as outcome_qty,
                COALESCE(wi.income_qty, 0) - COALESCE(wo.outcome_qty, 0) as remaining_qty,
                COALESCE(wi.total_income_value, 0) as total_income_value,
                COALESCE(wo.total_outcome_value, 0) as total_outcome_value,
                CASE 
                    WHEN b.expire_date IS NOT NULL AND b.expire_date < CURDATE() THEN 'expired'
                    WHEN b.expire_date IS NOT NULL AND b.expire_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'expiring_soon'
                    ELSE 'valid'
                END as expiry_status,
                CASE 
                    WHEN b.expire_date IS NOT NULL THEN DATEDIFF(b.expire_date, CURDATE())
                    ELSE NULL
                END as days_to_expiry
            FROM batches b
            LEFT JOIN products p ON b.product_id = p.id
            LEFT JOIN (
                SELECT 
                    batch_id,
                    warehouse_id,
                    SUM(quantity) as income_qty,
                    SUM(total) as total_income_value
                FROM warehouse_incomes 
                WHERE batch_id IS NOT NULL
                GROUP BY batch_id, warehouse_id
            ) wi ON b.id = wi.batch_id
            LEFT JOIN (
                SELECT 
                    batch_id,
                    warehouse_id,
                    SUM(quantity) as outcome_qty,
                    SUM(total) as total_outcome_value
                FROM warehouse_outcomes 
                WHERE batch_id IS NOT NULL
                GROUP BY batch_id, warehouse_id
            ) wo ON b.id = wo.batch_id AND wi.warehouse_id = wo.warehouse_id
            LEFT JOIN warehouses w ON wi.warehouse_id = w.id OR wo.warehouse_id = w.id
            WHERE (wi.batch_id IS NOT NULL OR wo.batch_id IS NOT NULL)
            ORDER BY b.expire_date ASC, b.id DESC
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS warehouse_batch_inventory");
    }
}; 