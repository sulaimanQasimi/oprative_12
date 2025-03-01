<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Invoice Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for invoice templates including
    | company details and other customizable elements.
    |
    */

    'company' => [
        'name' => env('COMPANY_NAME', 'Company Name'),
        'address' => [
            'street' => env('COMPANY_STREET', '123 Business Street'),
            'city' => env('COMPANY_CITY', 'City'),
            'country' => env('COMPANY_COUNTRY', 'Country'),
        ],
        'contact' => [
            'phone' => env('COMPANY_PHONE', '+1234567890'),
            'email' => env('COMPANY_EMAIL', 'info@company.com'),
            'website' => env('COMPANY_WEBSITE', 'www.company.com'),
        ],
    ],

    'invoice' => [
        'header' => [
            'gradient' => [
                'from' => '#4f46e5',
                'to' => '#3b82f6',
            ],
        ],
    ],
];