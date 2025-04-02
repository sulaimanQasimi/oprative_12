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
        Schema::table('warehouse_products', function (Blueprint $table) {
            $table->integer('minimum_quantity')->default(0)->after('quantity');
            $table->integer('maximum_quantity')->nullable()->after('minimum_quantity');
            $table->boolean('is_active')->default(true)->after('maximum_quantity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('warehouse_products', function (Blueprint $table) {
            $table->dropColumn(['minimum_quantity', 'maximum_quantity', 'is_active']);
        });
    }
};
