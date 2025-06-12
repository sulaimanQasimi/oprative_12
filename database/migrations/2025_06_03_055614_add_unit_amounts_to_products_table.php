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
            $table->double('whole_sale_unit_amount')->default(0)->nullable()->after('retail_unit_id');
            $table->double('retails_sale_unit_amount')->default(0)->nullable()->after('whole_sale_unit_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['whole_sale_unit_amount', 'retails_sale_unit_amount']);
        });
    }
};
