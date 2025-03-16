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

        // This view calculates product movement statistics across warehouses
        // It combines income and outcome data to show:
        // - Total incoming quantities, prices and totals
        // - Total outgoing quantities, prices and totals
        // - Net quantities (income - outcome)
        // - Net totals and profit calculations
        // The view helps track inventory movements and financial metrics per product per warehouse
        DB::statement("
            CREATE VIEW warehouse_product_movements AS
            SELECT
                wi.product_id,
                wi.warehouse_id,
                COALESCE(SUM(wi.quantity), 0) as income_quantity,
                COALESCE(SUM(wi.price), 0) as income_price,
                COALESCE(SUM(wi.total), 0) as income_total,
                COALESCE(SUM(wo.quantity), 0) as outcome_quantity,
                COALESCE(SUM(wo.price), 0) as outcome_price,
                COALESCE(SUM(wo.total), 0) as outcome_total,
                COALESCE(SUM(wi.quantity), 0) - COALESCE(SUM(wo.quantity), 0) as net_quantity,
                COALESCE(SUM(wi.total), 0) - COALESCE(SUM(wo.total), 0) as net_total,
                COALESCE(SUM(wi.total), 0) - COALESCE(SUM(wo.total), 0) as profit
            FROM warehouse_incomes wi
            LEFT JOIN warehouse_outcomes wo ON wi.product_id = wo.product_id AND wi.warehouse_id = wo.warehouse_id
            GROUP BY wi.product_id, wi.warehouse_id
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
