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
        Schema::table('customer_stock_outcomes', function (Blueprint $table) {
            $table->unsignedBigInteger('batch_id')->nullable()->after('unit_name');
            $table->string('batch_reference')->nullable()->after('batch_id');
            $table->string('batch_number')->nullable()->after('batch_reference');
            
            $table->foreign('batch_id')->references('id')->on('batches')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_stock_outcomes', function (Blueprint $table) {
            $table->dropForeign(['batch_id']);
            $table->dropColumn(['batch_id', 'batch_reference', 'batch_number']);
        });
    }
};
