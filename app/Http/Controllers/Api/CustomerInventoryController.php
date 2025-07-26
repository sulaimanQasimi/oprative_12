<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @group Customer Inventory Management
 *
 * APIs for managing customer inventory and sales data
 */
class CustomerInventoryController extends Controller
{
    public function getByPurchase(Request $request, $purchaseId)
    {
        try {
            // Get customer inventory data for batches related to this purchase
            $inventoryData = DB::table('customer_inventory as ci')
                ->where('ci.purchase_id', $purchaseId)
                ->orderBy('ci.batch_id')
                ->orderBy('ci.customer_name')
                ->get();

            // Group by batch and calculate totals
            $batchSummary = DB::table('customer_inventory as ci')
                ->select(
                    'ci.batch_id',
                    'ci.batch_reference',
                    'ci.product_name',
                    'ci.product_barcode',
                    'ci.issue_date',
                    'ci.expire_date',
                    'ci.expiry_status',
                    'ci.days_to_expiry',
                    'ci.unit_type',
                    'ci.unit_name',
                    'ci.purchase_price',
                    'ci.wholesale_price',
                    'ci.retail_price',
                    'ci.unit_amount',
                    'ci.unit_name',

                    DB::raw('SUM(ci.income_qty) as total_received'),
                    DB::raw('SUM(ci.outcome_qty) as total_sold'),
                    DB::raw('SUM(ci.remaining_qty) as total_remaining'),
                    DB::raw('SUM(ci.total_income_value) as total_income_value'),
                    DB::raw('SUM(ci.total_outcome_value) as total_outcome_value'),
                    DB::raw('COUNT(DISTINCT ci.customer_id) as customers_count'),
                    DB::raw('GROUP_CONCAT(DISTINCT ci.customer_name SEPARATOR ", ") as customer_names')
                )
                ->where('ci.purchase_id', $purchaseId)
                ->groupBy(
                    'ci.batch_id', 'ci.batch_reference', 'ci.product_name', 'ci.product_barcode',
                    'ci.issue_date', 'ci.expire_date', 'ci.expiry_status', 'ci.days_to_expiry',
                      'ci.unit_type', 'ci.unit_name', 'ci.purchase_price', 'ci.wholesale_price', 'ci.retail_price'
                )
                ->get();

            // Calculate sales performance metrics
            $salesMetrics = DB::table('customer_inventory as ci')
                ->select(
                    DB::raw('COUNT(DISTINCT ci.batch_id) as total_batches'),
                    DB::raw('COUNT(DISTINCT ci.customer_id) as total_customers'),
                    DB::raw('SUM(ci.income_qty) as total_received_qty'),
                    DB::raw('SUM(ci.outcome_qty) as total_sold_qty'),
                    DB::raw('SUM(ci.remaining_qty) as total_remaining_qty'),
                    DB::raw('SUM(ci.total_income_value) as total_sales_value'),
                    DB::raw('SUM(ci.total_outcome_value) as total_cost_value'),
                    DB::raw('SUM(ci.total_income_value - ci.total_outcome_value) as total_profit'),
                    DB::raw('AVG(CASE WHEN ci.income_qty > 0 THEN (ci.outcome_qty / ci.income_qty) * 100 ELSE 0 END) as avg_sell_through_rate')
                )
                ->where('ci.purchase_id', $purchaseId)
                ->first();

            // Get top customers by sales value
            $topCustomers = DB::table('customer_inventory as ci')
                ->select(
                    'ci.customer_id',
                    'ci.customer_name',
                    'ci.customer_email',
                    'ci.customer_phone',
                    DB::raw('SUM(ci.outcome_qty) as total_purchased_qty'),
                    DB::raw('SUM(ci.total_outcome_value) as total_purchased_value'),
                    DB::raw('COUNT(DISTINCT ci.batch_id) as batches_purchased')
                )
                ->where('ci.purchase_id', $purchaseId)
                ->whereNotNull('ci.customer_id')
                ->groupBy('ci.customer_id', 'ci.customer_name', 'ci.customer_email', 'ci.customer_phone')
                ->orderBy('total_purchased_value', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'inventory_data' => $inventoryData,
                'batch_summary' => $batchSummary,
                'sales_metrics' => $salesMetrics,
                'top_customers' => $topCustomers
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch customer inventory data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getSalesAnalytics(Request $request, $purchaseId)
    {
        try {
            // Daily sales trend for this purchase
            $dailySales = DB::table('customer_stock_outcomes as cso')
                ->join('batches as b', 'cso.batch_id', '=', 'b.id')
                ->select(
                    DB::raw('DATE(cso.created_at) as sale_date'),
                    DB::raw('SUM(cso.quantity) as daily_qty'),
                    DB::raw('SUM(cso.total) as daily_value')
                )
                ->where('b.purchase_id', $purchaseId)
                ->groupBy(DB::raw('DATE(cso.created_at)'))
                ->orderBy('sale_date', 'desc')
                ->limit(30)
                ->get();

            // Product performance analysis
            $productPerformance = DB::table('customer_inventory as ci')
                ->select(
                    'ci.product_name',
                    'ci.product_barcode',
                    DB::raw('SUM(ci.income_qty) as total_received'),
                    DB::raw('SUM(ci.outcome_qty) as total_sold'),
                    DB::raw('SUM(ci.remaining_qty) as remaining_stock'),
                    DB::raw('CASE WHEN SUM(ci.income_qty) > 0 THEN (SUM(ci.outcome_qty) / SUM(ci.income_qty)) * 100 ELSE 0 END as sell_through_percentage'),
                    DB::raw('SUM(ci.total_income_value - ci.total_outcome_value) as profit'),
                    DB::raw('COUNT(DISTINCT ci.customer_id) as unique_customers')
                )
                ->where('ci.purchase_id', $purchaseId)
                ->groupBy('ci.product_name', 'ci.product_barcode')
                ->orderBy('total_sold', 'desc')
                ->get();

            return response()->json([
                'daily_sales' => $dailySales,
                'product_performance' => $productPerformance
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch sales analytics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getWarehouseInventory(Request $request, $purchaseId)
    {
        try {
            // Get warehouse inventory data for batches related to this purchase
            $warehouseInventory = DB::table('warehouse_batch_inventory as wbi')
                ->join('batches as b', 'wbi.batch_id', '=', 'b.id')
                ->select('wbi.*')
                ->where('b.purchase_id', $purchaseId)
                ->orderBy('wbi.warehouse_name')
                ->orderBy('wbi.batch_id')
                ->get();

            // Group by warehouse and calculate totals
            $warehouseSummary = DB::table('warehouse_batch_inventory as wbi')
                ->join('batches as b', 'wbi.batch_id', '=', 'b.id')
                ->select(
                    'wbi.warehouse_id',
                    'wbi.warehouse_name',
                    DB::raw('COUNT(DISTINCT wbi.batch_id) as total_batches'),
                    DB::raw('COUNT(DISTINCT wbi.product_id) as total_products'),
                    DB::raw('SUM(wbi.income_qty) as total_received'),
                    DB::raw('SUM(wbi.outcome_qty) as total_dispatched'),
                    DB::raw('SUM(wbi.remaining_qty) as total_remaining'),
                    DB::raw('SUM(wbi.total_income_value) as total_value'),
                    DB::raw('AVG(CASE WHEN wbi.income_qty > 0 THEN (wbi.outcome_qty / wbi.income_qty) * 100 ELSE 0 END) as avg_utilization_rate')
                )
                ->where('b.purchase_id', $purchaseId)
                ->whereNotNull('wbi.warehouse_id')
                ->groupBy('wbi.warehouse_id', 'wbi.warehouse_name')
                ->orderBy('total_value', 'desc')
                ->get();

            // Get batch details by warehouse
            $batchDetails = DB::table('warehouse_batch_inventory as wbi')
                ->join('batches as b', 'wbi.batch_id', '=', 'b.id')
                ->select(
                    'wbi.batch_id',
                    'wbi.batch_reference',
                    'wbi.product_name',
                    'wbi.product_barcode',
                    'wbi.warehouse_id',
                    'wbi.warehouse_name',
                    'wbi.unit_type',
                    'wbi.unit_name',
                    'wbi.income_qty',
                    'wbi.outcome_qty',
                    'wbi.remaining_qty',
                    'wbi.total_income_value',
                    'wbi.total_outcome_value',
                    'wbi.issue_date',
                    'wbi.expire_date',
                    'wbi.expiry_status',
                    'wbi.days_to_expiry',
                    'wbi.batch_notes'
                )
                ->where('b.purchase_id', $purchaseId)
                ->orderBy('wbi.warehouse_name')
                ->orderBy('wbi.expiry_status', 'desc')
                ->orderBy('wbi.expire_date')
                ->get();

            // Calculate overall warehouse metrics
            $warehouseMetrics = DB::table('warehouse_batch_inventory as wbi')
                ->join('batches as b', 'wbi.batch_id', '=', 'b.id')
                ->select(
                    DB::raw('COUNT(DISTINCT wbi.warehouse_id) as total_warehouses'),
                    DB::raw('COUNT(DISTINCT wbi.batch_id) as total_batches'),
                    DB::raw('SUM(wbi.income_qty) as total_received_qty'),
                    DB::raw('SUM(wbi.outcome_qty) as total_dispatched_qty'),
                    DB::raw('SUM(wbi.remaining_qty) as total_remaining_qty'),
                    DB::raw('SUM(wbi.total_income_value) as total_inventory_value'),
                    DB::raw('SUM(wbi.total_outcome_value) as total_dispatched_value'),
                    DB::raw('AVG(CASE WHEN wbi.income_qty > 0 THEN (wbi.outcome_qty / wbi.income_qty) * 100 ELSE 0 END) as avg_dispatch_rate')
                )
                ->where('b.purchase_id', $purchaseId)
                ->first();

            // Get expiry analysis
            $expiryAnalysis = DB::table('warehouse_batch_inventory as wbi')
                ->join('batches as b', 'wbi.batch_id', '=', 'b.id')
                ->select(
                    'wbi.expiry_status',
                    DB::raw('COUNT(DISTINCT wbi.batch_id) as batch_count'),
                    DB::raw('SUM(wbi.remaining_qty) as remaining_qty'),
                    DB::raw('SUM(wbi.total_income_value) as total_value')
                )
                ->where('b.purchase_id', $purchaseId)
                ->groupBy('wbi.expiry_status')
                ->get();

            return response()->json([
                'warehouse_inventory' => $warehouseInventory,
                'warehouse_summary' => $warehouseSummary,
                'batch_details' => $batchDetails,
                'warehouse_metrics' => $warehouseMetrics,
                'expiry_analysis' => $expiryAnalysis
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch warehouse inventory data',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 