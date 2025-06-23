<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // You can add authorization logic here
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'min_quantity' => 'nullable|integer|min:0',
            'category_id' => 'required|integer|exists:categories,id',
            'unit_id' => 'required|integer|exists:units,id',
            'image' => 'nullable|string|max:255',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'status' => 'nullable|boolean',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'warehouse_quantities' => 'nullable|array',
            'warehouse_quantities.*.warehouse_id' => 'required_with:warehouse_quantities|integer|exists:warehouses,id',
            'warehouse_quantities.*.quantity' => 'required_with:warehouse_quantities|integer|min:0',
        ];

        // For updates, make code unique except for current product
        if ($this->isMethod('POST')) {
            $rules['code'] = 'required|string|max:100|unique:products,code';
        } else {
            $productId = $this->route('product') ? $this->route('product')->id : null;
            $rules['code'] = [
                'required',
                'string',
                'max:100',
                Rule::unique('products', 'code')->ignore($productId)
            ];

            // For updates, make barcode unique except for current product
            $rules['barcode'] = [
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'barcode')->ignore($productId)
            ];
        }

        return $rules;
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.max' => 'Product name cannot exceed 255 characters.',
            'code.required' => 'Product code is required.',
            'code.unique' => 'This product code is already taken.',
            'code.max' => 'Product code cannot exceed 100 characters.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Product price must be a valid number.',
            'price.min' => 'Product price cannot be negative.',
            'cost.required' => 'Product cost is required.',
            'cost.numeric' => 'Product cost must be a valid number.',
            'cost.min' => 'Product cost cannot be negative.',
            'quantity.required' => 'Product quantity is required.',
            'quantity.integer' => 'Product quantity must be a whole number.',
            'quantity.min' => 'Product quantity cannot be negative.',
            'min_quantity.integer' => 'Minimum quantity must be a whole number.',
            'min_quantity.min' => 'Minimum quantity cannot be negative.',
            'category_id.required' => 'Product category is required.',
            'category_id.exists' => 'Selected category does not exist.',
            'unit_id.required' => 'Product unit is required.',
            'unit_id.exists' => 'Selected unit does not exist.',
            'barcode.unique' => 'This barcode is already assigned to another product.',
            'tax_rate.numeric' => 'Tax rate must be a valid number.',
            'tax_rate.min' => 'Tax rate cannot be negative.',
            'tax_rate.max' => 'Tax rate cannot exceed 100%.',
            'warehouse_quantities.array' => 'Warehouse quantities must be an array.',
            'warehouse_quantities.*.warehouse_id.required_with' => 'Warehouse ID is required when specifying warehouse quantities.',
            'warehouse_quantities.*.warehouse_id.exists' => 'Selected warehouse does not exist.',
            'warehouse_quantities.*.quantity.required_with' => 'Quantity is required when specifying warehouse quantities.',
            'warehouse_quantities.*.quantity.integer' => 'Warehouse quantity must be a whole number.',
            'warehouse_quantities.*.quantity.min' => 'Warehouse quantity cannot be negative.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'product name',
            'code' => 'product code',
            'description' => 'product description',
            'price' => 'selling price',
            'cost' => 'cost price',
            'quantity' => 'quantity',
            'min_quantity' => 'minimum quantity',
            'category_id' => 'category',
            'unit_id' => 'unit',
            'image' => 'product image',
            'barcode' => 'barcode',
            'status' => 'status',
            'tax_rate' => 'tax rate',
        ];
    }
}
