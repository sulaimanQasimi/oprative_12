<?php

namespace App\Http\Requests\Admin\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update_supplier', $this->route('supplier'));
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
            'image' => 'nullable|string|max:255',
            'id_number' => 'nullable|string|max:255',
            // Bank information
            'bank_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:255',
            'bank_account_name' => 'nullable|string|max:255',
            'bank_account_branch' => 'nullable|string|max:255',
            'bank_account_swift_code' => 'nullable|string|max:255',
            'bank_account_iban' => 'nullable|string|max:255',
            // License information
            'license_number' => 'nullable|string|max:255',
            'license_expiration_date' => 'nullable|date',
            'license_type' => 'nullable|string|max:255',
            'license_file' => 'nullable|string|max:255',
            // Other information
            'notes' => 'nullable|string|max:1000',
            'status' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'youtube' => 'nullable|url|max:255',
            'tiktok' => 'nullable|url|max:255',
            'pinterest' => 'nullable|url|max:255',
            'snapchat' => 'nullable|string|max:255',
            'telegram' => 'nullable|string|max:255',
            'whatsapp' => 'nullable|string|max:255',
            // Personal information
            'personal_id_number' => 'nullable|string|max:255',
            'personal_id_file' => 'nullable|string|max:255',
            'personal_id_type' => 'nullable|string|max:255',
            'personal_id_expiration_date' => 'nullable|date',
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
