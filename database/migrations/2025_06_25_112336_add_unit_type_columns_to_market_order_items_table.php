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
            $table->enum('unit_type', ['retail', 'wholesale'])->default('retail')->after('subtotal');
            $table->boolean('is_wholesale')->default(false)->after('unit_type');
            $table->foreignId('unit_id')->nullable()->constrained('units')->nullOnDelete()->after('is_wholesale');
            $table->decimal('unit_amount', 10, 2)->default(1)->after('unit_id');
            $table->string('unit_name')->nullable()->after('unit_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('market_order_items', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->dropColumn(['unit_type', 'is_wholesale', 'unit_id', 'unit_amount', 'unit_name']);
        });
    }
};
