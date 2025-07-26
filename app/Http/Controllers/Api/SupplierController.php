<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

/**
 * @group Supplier Management
 *
 * APIs for managing suppliers
 */
class SupplierController extends Controller
{
    public function select(Request $request)
    {
        $query = Supplier::query();
        
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%')
                  ->orWhere('company', 'like', '%' . $search . '%');
            });
        }

        $suppliers = $query->orderBy('name')->get();

        return $suppliers->map(function ($supplier) {
            $subtitle = [];
            if ($supplier->company) {
                $subtitle[] = $supplier->company;
            }
            if ($supplier->email) {
                $subtitle[] = $supplier->email;
            }
            if ($supplier->phone) {
                $subtitle[] = $supplier->phone;
            }
            
            return [
                'value' => $supplier->id,
                'label' => $supplier->name,
                'subtitle' => !empty($subtitle) ? implode(' • ', $subtitle) : "ID: {$supplier->id}",
                'supplier' => $supplier->toArray()
            ];
        });
    }
} 