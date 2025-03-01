<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $currencies = [
            [
                'name' => 'افغانی', // افغانی
                'code' => 'AFN',

            ],
            [
                'name' => 'ریال ایران', // ریال ایران
                'code' => 'IRR',
            ],
            [
                'name' => 'دلار آمریکا', // دلار آمریکا
                'code' => 'USD',
            ],
            [
                'name' => 'یورو', // یورو
                'code' => 'EUR',
            ],
            [
                'name' => 'پوند انگلیس', // پوند انگلیس
                'code' => 'GBP',
            ],
            [
                'name' => 'درهم امارات', // درهم امارات
                'code' => 'AED',
            ],
            [
                'name' => 'ریال عربستان', // ریال عربستان
                'code' => 'SAR',
            ],
            [
                'name' => 'لیر ترکیه', // لیر ترکیه
                'code' => 'TRY',
            ]
        ];

        foreach ($currencies as $currency) {
            Currency::create($currency);
        }
    }
}
