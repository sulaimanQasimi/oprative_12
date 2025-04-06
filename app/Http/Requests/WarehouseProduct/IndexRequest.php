<?php

namespace App\Http\Requests\WarehouseProduct;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class IndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'sort_by' => ['sometimes', 'string', 'in:net_quantity,created_at,updated_at,min_quantity,max_quantity'],
            'sort_direction' => ['sometimes', 'string', 'in:asc,desc'],
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'warehouse_id' => ['sometimes', 'nullable', 'integer', 'exists:warehouses,id'],
            'category_id' => ['sometimes', 'nullable', 'integer', 'exists:product_categories,id'],
            'min_stock' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'max_stock' => ['sometimes', 'nullable', 'numeric', 'min:0', 'gte:min_stock'],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator($validator): void
    {
        if ($validator->fails()) {
            Log::warning('Failed warehouse product filter validation', [
                'ip' => request()->ip(),
                'user_agent' => request()->header('User-Agent'),
                'errors' => $validator->errors()->toArray(),
            ]);
        }
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'per_page.integer' => 'The number of items per page must be a valid number.',
            'per_page.min' => 'At least one item per page is required.',
            'per_page.max' => 'The maximum number of items per page is 100.',
            'sort_by.in' => 'The selected sort field is invalid.',
            'sort_direction.in' => 'Sort direction must be ascending or descending.',
            'warehouse_id.exists' => 'The selected warehouse does not exist.',
            'category_id.exists' => 'The selected product category does not exist.',
            'max_stock.gte' => 'The maximum stock must be greater than or equal to the minimum stock.',
        ];
    }
}
