<?php

use App\Models\Product;
use App\Models\Warehouse;
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
        Schema::create('warehouse_outcomes', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number');
            $table->foreignIdFor(Warehouse::class);
            $table->foreignIdFor(Product::class);
            $table->double('quantity')->nullable();
            $table->double('price')->nullable();
            $table->double('total')->nullable();
            $table->nullableMorphs('model');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_outcomes');
    }
};
