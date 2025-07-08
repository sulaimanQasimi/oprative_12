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
            $table->string("name");
            $table->string("barcode")->nullable();
            $table->unsignedBigInteger("category_id")->nullable();
            $table->unsignedBigInteger("unit_id")->nullable();

            //Options
            $table->boolean("status")->default(1)->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('unit_id')->references('id')->on('units')->onDelete('set null');

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
