<?php

use App\Models\Currency;
use App\Models\Supplier;
use App\Models\User;
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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->nullable();
            $table->foreignIdFor(Supplier::class)->nullable();
            $table->foreignIdFor(Currency::class)->nullable();
            $table->string("invoice_number")->nullable();
            $table->date("invoice_date")->nullable();
            $table->string("currency_rate")->nullable();
            $table->string("status")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('purchase_has_addional_costs', function (Blueprint $table) {
            $table->foreignId("purchase_id")->references('id')->on('purchases')->onDelete('cascade')->unsigned();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
        Schema::dropIfExists('purchase_has_addional_costs');
    }
};
