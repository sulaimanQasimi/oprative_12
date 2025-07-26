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
        DB::statement('DROP VIEW IF EXISTS customer_inventory');
   
        DB::statement("
            CREATE VIEW customer_inventory AS
            SELECT 
                b.id as batch_id,
                b.product_id,
                b.reference_number as batch_reference,
                b.issue_date,
                b.expire_date,
                b.notes as batch_notes,
                p.name as product_name,
                p.barcode as product_barcode,
                c.id as customer_id,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone,
                b.unit_type,
                b.unit_id,
                b.unit_amount,
                b.unit_name,
                -- Batch pricing information
                b.purchase_price,
                b.wholesale_price,
                b.retail_price,
                b.price,
                b.total,
                b.quantity,
                -- Stock calculations
                COALESCE(ci.income_qty, 0) as income_qty,
                COALESCE(co.outcome_qty, 0) as outcome_qty,
                COALESCE(ci.income_qty, 0) - COALESCE(co.outcome_qty, 0) as remaining_qty,
                COALESCE(ci.total_income_value, 0) as total_income_value,
                COALESCE(co.total_outcome_value, 0) as total_outcome_value,
                -- Additional batch properties
                b.purchase_id,
                b.purchase_item_id,
                b.is_wholesale,
                -- Expiry status
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
                    customer_id,
                    SUM(quantity) as income_qty,
                    SUM(total) as total_income_value
                FROM customer_stock_incomes 
                WHERE batch_id IS NOT NULL
                GROUP BY batch_id, customer_id
            ) ci ON b.id = ci.batch_id
            LEFT JOIN (
                SELECT 
                    batch_id,
                    customer_id,
                    SUM(quantity) as outcome_qty,
                    SUM(total) as total_outcome_value
                FROM customer_stock_outcomes 
                WHERE batch_id IS NOT NULL
                GROUP BY batch_id, customer_id
            ) co ON b.id = co.batch_id AND ci.customer_id = co.customer_id
            LEFT JOIN customers c ON ci.customer_id = c.id OR co.customer_id = c.id
            WHERE (ci.batch_id IS NOT NULL OR co.batch_id IS NOT NULL)
            ORDER BY b.expire_date ASC, b.id DESC
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {   
        DB::statement('DROP VIEW IF EXISTS customer_inventory');
    }
}; 