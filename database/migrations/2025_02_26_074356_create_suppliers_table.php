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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('image')->nullable();
            $table->string('id_number')->nullable();
            // Bank information
            $table->string('bank_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_account_branch')->nullable();
            $table->string('bank_account_swift_code')->nullable();
            $table->string('bank_account_iban')->nullable();

            // License information
            $table->string('license_number')->nullable();
            $table->date('license_expiration_date')->nullable();
            $table->string('license_type')->nullable();
            $table->string('license_file')->nullable();

            // Tax information

            // Other information
            $table->string('notes')->nullable();
            $table->string('status')->nullable();
            $table->string('type')->nullable();
            $table->string('website')->nullable();
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('twitter')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('youtube')->nullable();
            $table->string('tiktok')->nullable();
            $table->string('pinterest')->nullable();
            $table->string('snapchat')->nullable();
            $table->string('telegram')->nullable();
            $table->string('whatsapp')->nullable();
            
            // Personal information
            $table->string('personal_id_number')->nullable();
            $table->string('personal_id_file')->nullable();
            $table->string('personal_id_type')->nullable();
            $table->string('personal_id_expiration_date')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
