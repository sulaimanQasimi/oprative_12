<?php

use App\Models\MarketOrder;
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
        Schema::create('market_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(MarketOrder::class)->constrained('market_orders')->onDelete('cascade');
            $table->foreignIdFor(Product::class)->constrained('products')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('unit_price', total: 10, places: 2);
            $table->decimal('subtotal', total: 10, places: 2);
            $table->decimal('discount_amount', total: 10, places: 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_order_items');
    }
};
