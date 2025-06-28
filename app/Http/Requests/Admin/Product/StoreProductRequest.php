<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create_product');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'barcode' => 'nullable|string|max:255|unique:products,barcode',
            'purchase_price' => 'required|numeric|min:0',
            'wholesale_price' => 'required|numeric|min:0',
            'retail_price' => 'required|numeric|min:0',
            'is_activated' => 'boolean',
            'is_in_stock' => 'boolean',
            'is_shipped' => 'boolean',
            'is_trend' => 'boolean',
            'wholesale_unit_id' => 'required|exists:units,id',
            'retail_unit_id' => 'required|exists:units,id',
            'whole_sale_unit_amount' => 'nullable|numeric|min:0',
            'retails_sale_unit_amount' => 'nullable|numeric|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Product type is required.',
            'name.required' => 'Product name is required.',
            'purchase_price.required' => 'Purchase price is required.',
            'wholesale_price.required' => 'Wholesale price is required.',
            'retail_price.required' => 'Retail price is required.',
            'wholesale_unit_id.required' => 'Wholesale unit is required.',
            'retail_unit_id.required' => 'Retail unit is required.',
            'barcode.unique' => 'This barcode is already in use.',
        ];
    }
}
