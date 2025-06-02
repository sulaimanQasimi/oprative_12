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
        Schema::table('warehouse_transfers', function (Blueprint $table) {
            $table->string('reference_number')->nullable()->after('id');
            $table->decimal('price', 15, 2)->default(0)->after('quantity');
            $table->decimal('total', 15, 2)->default(0)->after('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('warehouse_transfers', function (Blueprint $table) {
            $table->dropColumn(['reference_number', 'price', 'total']);
        });
    }
};
