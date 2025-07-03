<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->date('issue_date')->nullable();
            $table->date('expire_date')->nullable();
            $table->string('reference_number')->nullable();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('purchase_id')->nullable();
            $table->unsignedBigInteger('purchase_item_id')->nullable();
            $table->decimal('quantity', 15, 2)->default(0);
            $table->decimal('price', 15, 2)->default(0);
            $table->decimal('wholesale_price', 15, 2)->nullable();
            $table->decimal('retail_price', 15, 2)->nullable();
            $table->decimal('purchase_price', 15, 2)->nullable();
            $table->decimal('total', 15, 2)->default(0);
            $table->string('unit_type')->nullable();
            $table->boolean('is_wholesale')->default(false);
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->decimal('unit_amount', 15, 2)->default(0);
            $table->string('unit_name')->nullable();
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->nullOnDelete();
            $table->foreign('unit_id')->references('id')->on('units')->nullOnDelete();
            $table->foreign('purchase_id')->references('id')->on('purchases')->nullOnDelete();
            $table->foreign('purchase_item_id')->references('id')->on('purchase_items')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::dropIfExists('batches');
    }
}; 