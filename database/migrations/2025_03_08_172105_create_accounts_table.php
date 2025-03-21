<?php

use App\Models\AccountType;
use App\Models\Branch;
use App\Models\Customer;
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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Customer::class)->references('id')->on('customers')->onDelete('RESTRICT');
            $table->string('account_number')->unique();
            $table->string('name');
            $table->string('phone');
            $table->string('id_number');
            $table->foreignIdFor(AccountType::class)->references('id')->on('account_types')->onDelete('RESTRICT');
            $table->dateTime('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
