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
        Schema::table('purchase_has_addional_costs', function (Blueprint $table) {
            $table->foreignId('purchase_item_id')->nullable()->references('id')->on('purchase_items')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_has_addional_costs', function (Blueprint $table) {
            $table->dropForeign(['purchase_item_id']);
            $table->dropColumn(['purchase_item_id', 'description']);
            $table->dropTimestamps();
        });
    }
}; 