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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('photo')->nullable()->comment('Path to employee photo');
            $table->string('taskra_id')->unique()->comment('Unique Taskra ID');
            $table->string('first_name')->comment('Employee first name');
            $table->string('last_name')->comment('Employee last name');
            $table->string('employee_id')->unique()->comment('Unique employee ID');
            $table->string('department')->comment('Employee department');
            $table->json('contact_info')->nullable()->comment('Contact information as JSON');
            $table->string('email')->unique()->comment('Employee email address');
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index(['first_name', 'last_name']);
            $table->index('department');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
