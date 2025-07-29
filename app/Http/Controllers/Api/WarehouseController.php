<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;

/**
 * @group Warehouse Management
 *
 * APIs for managing warehouses
 */
class WarehouseController extends Controller
{
    public function select(Request $request)
    {
        $query = Warehouse::query();
        
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('code', 'like', '%' . $search . '%')
                  ->orWhere('address', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%');
            });
        }
        $query->when($request->has('except'), function($q) use ($request) {
            $q->whereNot('id', $request->except);
        });

        $warehouses = $query->orderBy('name')->get();

        return $warehouses->map(function ($warehouse) {
            $subtitle = [];
            if ($warehouse->code) {
                $subtitle[] = "Code: {$warehouse->code}";
            }
            if ($warehouse->address) {
                $subtitle[] = $warehouse->address;
            }
            if ($warehouse->phone) {
                $subtitle[] = $warehouse->phone;
            }
            
            return [
                'value' => $warehouse->id,
                'label' => $warehouse->name,
                'subtitle' => !empty($subtitle) ? implode(' • ', $subtitle) : "ID: {$warehouse->id}",
                'warehouse' => $warehouse->toArray()
            ];
        });
    }
} 