<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // This view calculates product movement statistics across warehouses
        // It combines income and outcome data to show:
        // - Total incoming quantities, prices and totals
        // - Total outgoing quantities, prices and totals
        // - Net quantities (income - outcome)
        // - Net totals and profit calculations
        // The view helps track inventory movements and financial metrics per product per warehouse
        DB::statement("DROP VIEW IF EXISTS warehouse_product_movements");

        DB::statement("
            CREATE VIEW warehouse_product_movements AS
            WITH income_summary AS (
                SELECT
                    product_id,
                    warehouse_id,
                    SUM(quantity) as income_quantity,
                    SUM(price) as income_price,
                    SUM(total) as income_total
                FROM warehouse_incomes
                GROUP BY product_id, warehouse_id
            ),
            outcome_summary AS (
                SELECT
                    product_id,
                    warehouse_id,
                    SUM(quantity) as outcome_quantity,
                    SUM(price) as outcome_price,
                    SUM(total) as outcome_total
                FROM warehouse_outcomes
                GROUP BY product_id, warehouse_id
            )
            SELECT
                i.product_id,
                i.warehouse_id,
                COALESCE(i.income_quantity, 0) as income_quantity,
                COALESCE(i.income_price, 0) as income_price,
                COALESCE(i.income_total, 0) as income_total,
                COALESCE(o.outcome_quantity, 0) as outcome_quantity,
                COALESCE(o.outcome_price, 0) as outcome_price,
                COALESCE(o.outcome_total, 0) as outcome_total,
                COALESCE(i.income_quantity, 0) - COALESCE(o.outcome_quantity, 0) as net_quantity,
                COALESCE(i.income_total, 0) - COALESCE(o.outcome_total, 0) as net_total,
                COALESCE(i.income_total, 0) - COALESCE(o.outcome_total, 0) as profit
            FROM income_summary i
            LEFT JOIN outcome_summary o ON i.product_id = o.product_id AND i.warehouse_id = o.warehouse_id
        ");
    }

    public function down()
    {
        // This view calculates product movement statistics across warehouses
        // It combines income and outcome data to show:
        // - Total incoming quantities, prices and totals
        // - Total outgoing quantities, prices and totals
        // - Net quantities (income - outcome)
        // - Net totals and profit calculations
        // The view helps track inventory movements and financial metrics per product per warehouse
        DB::statement("DROP VIEW IF EXISTS warehouse_product_movements");
    }
};
