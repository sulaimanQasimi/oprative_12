<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        // Get batches from warehouse_batch_inventory view
        $batches = DB::table('warehouse_batch_inventory')
            ->where('warehouse_id', $warehouse->id)
            ->get()
            ->map(function ($batch) {
                return [
                    "batch_id" => $batch->batch_id,
                    "product_id" => $batch->product_id,
                    "product" => [
                        "id" => $batch->product_id,
                        "name" => $batch->product_name,
                        "barcode" => $batch->product_barcode,
                        "type" => "Product",
                    ],
                    "batch_reference" => $batch->batch_reference,
                    "issue_date" => $batch->issue_date,
                    "expire_date" => $batch->expire_date,
                    "batch_notes" => $batch->batch_notes,
                    "unit_type" => $batch->unit_type,
                    "unit_id" => $batch->unit_id,
                    "unit_amount" => $batch->unit_amount,
                    "unit_name" => $batch->unit_name,
                    "income_qty" => $batch->income_qty/$batch->unit_amount,
                    "outcome_qty" => $batch->outcome_qty/$batch->unit_amount,
                    "remaining_qty" => $batch->remaining_qty/$batch->unit_amount,
                    "total_income_value" => $batch->total_income_value,
                    "total_outcome_value" => $batch->total_outcome_value,
                    "expiry_status" => $batch->expiry_status,
                    "days_to_expiry" => $batch->days_to_expiry,
                ];
            })
            ->all();

        return Inertia::render('Warehouse/Products', [
            'products' => $batches, // We'll keep the prop name as 'products' for compatibility
        ]);
    }

    /**
     * Get overall expiry status for a product
     */
    private function getOverallExpiryStatus($expiredBatches, $expiringSoonBatches, $validBatches)
    {
        if ($expiredBatches > 0) {
            return 'expired';
        } elseif ($expiringSoonBatches > 0) {
            return 'expiring_soon';
        } else {
            return 'valid';
        }
    }
}
