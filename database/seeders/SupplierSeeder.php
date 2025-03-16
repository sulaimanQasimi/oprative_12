<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'TechVision Electronics',
                'contact_name' => 'John Smith',
                'phone' => '+1-555-0123',
                'email' => 'john@techvision.com',
                'address' => '123 Tech Street',
                'city' => 'San Francisco',
                'state' => 'California',
                'country' => 'USA',
                'postal_code' => '94105',
                'id_number' => 'SUP001',
            ],
            [
                'name' => 'Global Textiles Ltd',
                'contact_name' => 'Sarah Johnson',
                'phone' => '+44-20-7123-4567',
                'email' => 'sarah@globaltextiles.com',
                'address' => '45 Fabric Lane',
                'city' => 'London',
                'state' => 'England',
                'country' => 'UK',
                'postal_code' => 'EC1A 1BB',
                'id_number' => 'SUP002',
            ],
            [
                'name' => 'Fresh Foods Co',
                'contact_name' => 'Michael Chen',
                'phone' => '+61-2-8765-4321',
                'email' => 'michael@freshfoods.com',
                'address' => '789 Produce Road',
                'city' => 'Sydney',
                'state' => 'NSW',
                'country' => 'Australia',
                'postal_code' => '2000',
                'id_number' => 'SUP003',
            ],
            [
                'name' => 'Modern Furnishings',
                'contact_name' => 'Emma Davis',
                'phone' => '+1-604-555-0199',
                'email' => 'emma@modernfurnish.com',
                'address' => '456 Design Avenue',
                'city' => 'Vancouver',
                'state' => 'British Columbia',
                'country' => 'Canada',
                'postal_code' => 'V6B 1A1',
                'id_number' => 'SUP004',
            ],
            [
                'name' => 'Smart Gadgets Inc',
                'contact_name' => 'David Kim',
                'phone' => '+82-2-1234-5678',
                'email' => 'david@smartgadgets.com',
                'address' => '321 Innovation Blvd',
                'city' => 'Seoul',
                'state' => 'Seoul',
                'country' => 'South Korea',
                'postal_code' => '06134',
                'id_number' => 'SUP005',
            ]
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}