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
        Schema::create('ware_house_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('warehouse_id');
            $table->string('role')->default('staff'); // staff, manager, admin, etc.
            $table->boolean('is_active')->default(true);
            $table->timestamps();

              $table->foreign('warehouse_id')->references('id')->on('warehouses')->onDelete('cascade');

            // Ensure each user can be assigned to a warehouse only once
            $table->unique(['user_id', 'warehouse_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ware_house_users');
    }
};
