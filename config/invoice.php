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
        'name' => env('COMPANY_NAME', 'UNDP'),
        'address' => [
            'street' => env('COMPANY_STREET', 'Wazir Mohammad Akber Khan'),
            'city' => env('COMPANY_CITY', 'Kabul'),
            'country' => env('COMPANY_COUNTRY', 'Afghanistan'),
        ],
        'contact' => [
            'phone' => env('COMPANY_PHONE', '+93 202660488'),
            'email' => env('COMPANY_EMAIL', 'info@undp.org'),
            'website' => env('COMPANY_WEBSITE', 'www.undp.org'),
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
