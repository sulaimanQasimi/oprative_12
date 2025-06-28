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
            'type.required' => 'نوع محصول الزامی است.',
            'name.required' => 'نام محصول الزامی است.',
            'purchase_price.required' => 'قیمت خرید الزامی است.',
            'wholesale_price.required' => 'قیمت عمده الزامی است.',
            'retail_price.required' => 'قیمت خرده فروشی الزامی است.',
            'wholesale_unit_id.required' => 'واحد عمده الزامی است.',
            'retail_unit_id.required' => 'واحد خرده فروشی الزامی است.',
            'barcode.unique' => 'این بارکد قبلا استفاده شده است.',
        ];
    }
}
