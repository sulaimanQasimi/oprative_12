<?php

namespace App\Http\Requests\Admin\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create_supplier');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:50',
            'id_number' => 'nullable|string|max:255',
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
            'name.required' => 'نام تامین کننده الزامی است.',
            'name.max' => 'نام تامین کننده نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'contact_name.max' => 'نام تماس نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'email.email' => 'ایمیل باید معتبر باشد.',
            'email.max' => 'ایمیل نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'phone.max' => 'شماره تلفن نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'address.max' => 'آدرس نمی‌تواند بیشتر از 500 کاراکتر باشد.',
            'city.max' => 'شهر نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'state.max' => 'استان نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'country.max' => 'کشور نمی‌تواند بیشتر از 255 کاراکتر باشد.',
            'postal_code.max' => 'کد پستی نمی‌تواند بیشتر از 50 کاراکتر باشد.',
            'id_number.max' => 'شماره شناسایی نمی‌تواند بیشتر از 255 کاراکتر باشد.',
        ];
    }
}
