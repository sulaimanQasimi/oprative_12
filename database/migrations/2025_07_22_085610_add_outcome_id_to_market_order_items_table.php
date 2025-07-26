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
        Schema::table('market_order_items', function (Blueprint $table) {
            $table->foreignId('outcome_id')->nullable()->constrained('customer_stock_outcomes')->nullOnDelete()->after('unit_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('market_order_items', function (Blueprint $table) {
            $table->dropForeign(['outcome_id']);
            $table->dropColumn('outcome_id');
        });
    }
};
