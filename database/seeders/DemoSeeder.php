<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'type' => 'electronics',
                'name' => 'Smart Watch',
                'barcode' => '7891234567890',
                'purchase_price' => 150.00,
                'wholesale_price' => 187.50,
                'retail_price' => 250.00,
            ],
            [
                'type' => 'clothing',
                'name' => 'Cotton Shirt',
                'barcode' => '7891234567891',
                'purchase_price' => 25.00,
                'wholesale_price' => 31.25,
                'retail_price' => 45.00,
            ],
            [
                'type' => 'food',
                'name' => 'Organic Coffee',
                'barcode' => '7891234567892',
                'purchase_price' => 8.00,
                'wholesale_price' => 10.40,
                'retail_price' => 15.00,
            ],
            [
                'type' => 'furniture',
                'name' => 'Office Chair',
                'barcode' => '7891234567893',
                'purchase_price' => 80.00,
                'wholesale_price' => 104.00,
                'retail_price' => 150.00,
            ],
            [
                'type' => 'electronics',
                'name' => 'Wireless Earbuds',
                'barcode' => '7891234567894',
                'purchase_price' => 45.00,
                'wholesale_price' => 58.50,
                'retail_price' => 85.00,
            ]
        ];

        foreach ($products as $product) {
            Product::create([
                'type' => $product['type'],
                'name' => $product['name'],
                'barcode' => $product['barcode'],
                'purchase_price' => $product['purchase_price'],
                'wholesale_price' => $product['wholesale_price'],
                'retail_price' => $product['retail_price'],
                'purchase_profit' => $product['wholesale_price'] - $product['purchase_price'],
                'wholesale_profit' => $product['retail_price'] - $product['wholesale_price'],
                'retail_profit' => $product['retail_price'] - $product['purchase_price'],
                'is_activated' => true,
                'is_in_stock' => true,
                'is_shipped' => false,
                'is_trend' => false,
            ]);
        }
        $this->call(SupplierSeeder::class);
    }
}
