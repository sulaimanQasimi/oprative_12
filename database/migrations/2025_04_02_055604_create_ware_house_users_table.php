<?php

use App\Models\Warehouse;
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
            $table->foreignIdFor(Warehouse::class);
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->timestamps();
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
