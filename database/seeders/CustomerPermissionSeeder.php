<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\CustomerUser;

class CustomerPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create customer permissions
        $customerPermissions = [
            
            //Wallet permissions
            'warehouse.view_wallet'=>"مشاهده کیف پول",
            'warehouse.withdraw_wallet'=>"برداشت از کیف پول",
            'warehouse.deposit_wallet'=>"واریز در کیف پول",
            
            "customer.view_stock"=>"دیدن موجودی",
            // Orders permissions
            'customer.view_orders'=>"دیدن سفارشات",
            'customer.create_orders'=>"ایجاد سفارش",
            'customer.view_invoice'=>"پرنت بل مشتری",
            'customer.view_sales'=>"دیدن دریافت از گدام",
            'customer.manage_sales'=>"مدیریت دریافتی ها از گدام"
        ];

        // Create all permissions
        foreach ($customerPermissions as $permission=>$translated) {
            Permission::updateOrCreate(['name' => $permission],['label'=>$translated, 'guard_name' => 'customer_user']);
        }
    }
}
