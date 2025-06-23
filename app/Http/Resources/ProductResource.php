<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'price' => number_format($this->price, 2),
            'cost' => number_format($this->cost, 2),
            'quantity' => $this->quantity,
            'min_quantity' => $this->min_quantity,
            'image' => $this->image,
            'barcode' => $this->barcode,
            'status' => $this->status,
            'tax_rate' => $this->tax_rate,

            'unit' => $this->whenLoaded('unit', function () {
                return [
                    'id' => $this->unit->id,
                    'name' => $this->unit->name,
                    'symbol' => $this->unit->symbol,
                ];
            }),
            'total_value' => number_format($this->price * $this->quantity, 2),
            'cost_value' => number_format($this->cost * $this->quantity, 2),
            'profit_margin' => $this->price > 0 ? number_format((($this->price - $this->cost) / $this->price) * 100, 2) : '0.00',
            'is_low_stock' => $this->quantity <= $this->min_quantity,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i:s'),
        ];
    }
}