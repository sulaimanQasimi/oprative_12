<?php

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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string("type")->default('product')->nullable();
            $table->json("name");
            $table->string("barcode")->nullable();

            //Prices
            $table->double("purchase_price")->default(0)->nullable();
            $table->double("wholesale_price")->default(0)->nullable();;
            $table->double("retail_price")->default(0)->nullable();

            // Profit
            $table->double("purchase_profit")->default(0)->nullable();;
            $table->double("wholesale_profit")->default(0)->nullable();;
            $table->double("retail_profit")->default(0)->nullable();

            //Options
            $table->boolean("is_activated")->default(1)->nullable();
            $table->boolean("is_in_stock")->default(1)->nullable();
            $table->boolean("is_shipped")->default(0)->nullable();
            $table->boolean("is_trend")->default(0)->nullable();
            $table->timestamps();

        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
