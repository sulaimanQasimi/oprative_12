<?php

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_stock_incomes', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->foreignIdFor(Customer::class);
            $table->foreignIdFor(Product::class);
            $table->double('quantity')->nullable();
            $table->double('price')->nullable();
            $table->double('total')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_stock_incomes');
    }
};
