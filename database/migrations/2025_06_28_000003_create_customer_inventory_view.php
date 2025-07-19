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
                c.id as customer_id,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone,
                p.id as product_id,
                p.name as product_name,
                p.barcode as product_barcode,
                b.id as batch_id,
                b.reference_number as batch_reference,
                b.issue_date,
                b.expire_date,
                b.notes as batch_notes,
                COALESCE(ci.income_qty, 0) as income_qty,
                COALESCE(co.outcome_qty, 0) as outcome_qty,
                COALESCE(ci.income_qty, 0) - COALESCE(co.outcome_qty, 0) as remaining_qty,
                COALESCE(ci.total_income_value, 0) as total_income_value,
                COALESCE(co.total_outcome_value, 0) as total_outcome_value,
                COALESCE(ci.income_qty, 0) - COALESCE(co.outcome_qty, 0) as net_quantity,
                COALESCE(ci.total_income_value, 0) - COALESCE(co.total_outcome_value, 0) as net_value,
                ci.unit_type,
                ci.unit_id,
                ci.unit_amount,
                ci.unit_name,
                b.purchase_price,
                b.wholesale_price,
                b.retail_price,
                CASE 
                    WHEN b.expire_date IS NOT NULL AND b.expire_date < CURDATE() THEN 'expired'
                    WHEN b.expire_date IS NOT NULL AND b.expire_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'expiring_soon'
                    ELSE 'valid'
                END as expiry_status,
                CASE 
                    WHEN b.expire_date IS NOT NULL THEN DATEDIFF(b.expire_date, CURDATE())
                    ELSE NULL
                END as days_to_expiry
            FROM customers c
            CROSS JOIN products p
            LEFT JOIN batches b ON b.product_id = p.id
            LEFT JOIN (
                SELECT 
                    customer_id,
                    product_id,
                    batch_id,
                    unit_type,
                    unit_id,
                    unit_amount,
                    unit_name,
                    SUM(quantity) as income_qty,
                    SUM(total) as total_income_value
                FROM customer_stock_incomes 
                GROUP BY customer_id, product_id, batch_id, unit_type, unit_id, unit_amount, unit_name
            ) ci ON c.id = ci.customer_id AND p.id = ci.product_id AND (b.id = ci.batch_id OR (b.id IS NULL AND ci.batch_id IS NULL))
            LEFT JOIN (
                SELECT 
                    customer_id,
                    product_id,
                    unit_type,
                    unit_id,
                    unit_amount,
                    unit_name,
                    SUM(quantity) as outcome_qty,
                    SUM(total) as total_outcome_value
                FROM customer_stock_outcomes 
                GROUP BY customer_id, product_id, unit_type, unit_id, unit_amount, unit_name
            ) co ON c.id = co.customer_id AND p.id = co.product_id AND (ci.unit_type = co.unit_type OR (ci.unit_type IS NULL AND co.unit_type IS NULL))
            WHERE (ci.customer_id IS NOT NULL OR co.customer_id IS NOT NULL)
            ORDER BY c.name ASC, p.name ASC, b.expire_date ASC
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