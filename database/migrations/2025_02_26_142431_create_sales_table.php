<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('reference');
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $table->foreignId('currency_id')->constrained()->cascadeOnDelete();
            $table->decimal('currency_rate', 15, 4)->default(1);
            $table->string('status')->default('pending');
            $table->string('payment_status')->default('pending');
            $table->text('notes')->nullable();
            $table->double("total")->default(0)->nullable();
            $table->date('date');
            $table->boolean('moved_from_warehouse')->default(false);
            $table->boolean('confirmed_by_warehouse');
            $table->boolean('confirmed_by_shop');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
