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
        Schema::create('account_outcomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('RESTRICT');
            $table->foreignIdFor(\App\Models\Account::class)->references('id')->on('accounts')->onDelete('RESTRICT');
            $table->string('reference_number')->nullable();;
            $table->decimal('amount', 10, 2);
            $table->nullableMorphs('model');
            $table->dateTime('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_outcomes');
    }
};
