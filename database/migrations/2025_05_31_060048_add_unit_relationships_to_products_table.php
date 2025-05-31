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
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('wholesale_unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->foreignId('retail_unit_id')->nullable()->constrained('units')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['wholesale_unit_id']);
            $table->dropForeign(['retail_unit_id']);
            $table->dropColumn(['wholesale_unit_id', 'retail_unit_id']);
        });
    }
};
