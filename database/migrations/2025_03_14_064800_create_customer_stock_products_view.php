<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
            // This view calculates product movement statistics across warehouses
            // It combines income and outcome data to show:
            // - Total incoming quantities, prices and totals
            // - Total outgoing quantities, prices and totals
            // - Net quantities (income - outcome)
            // - Net totals and profit calculations
            // The view helps track inventory movements and financial metrics per product per warehouse
            DB::statement("DROP VIEW IF EXISTS customer_stock_product_movements");

            // This view calculates product movement statistics across warehouses
            // It combines income and outcome data to show:
            // - Total incoming quantities, prices and totals
            // - Total outgoing quantities, prices and totals
            // - Net quantities (income - outcome)
            // - Net totals and profit calculations
            // The view helps track inventory movements and financial metrics per product per warehouse
            DB::statement("
                CREATE VIEW customer_stock_product_movements AS
                SELECT
                    wi.product_id,
                    wi.customer_id,
                    COALESCE(SUM(wi.quantity), 0) as income_quantity,
                    COALESCE(SUM(wi.price), 0) as income_price,
                    COALESCE(SUM(wi.total), 0) as income_total,
                    COALESCE(SUM(wo.quantity), 0) as outcome_quantity,
                    COALESCE(SUM(wo.price), 0) as outcome_price,
                    COALESCE(SUM(wo.total), 0) as outcome_total,
                    COALESCE(SUM(wi.quantity), 0) - COALESCE(SUM(wo.quantity), 0) as net_quantity,
                    COALESCE(SUM(wi.total), 0) - COALESCE(SUM(wo.total), 0) as net_total,
                    COALESCE(SUM(wi.total), 0) - COALESCE(SUM(wo.total), 0) as profit
                FROM customer_stock_incomes wi
                LEFT JOIN customer_stock_outcomes wo ON wi.product_id = wo.product_id AND wi.customer_id = wo.customer_id
                GROUP BY wi.product_id, wi.customer_id
            ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS customer_stock_product_movements");
    }
};
