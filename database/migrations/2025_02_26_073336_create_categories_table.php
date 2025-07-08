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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique()->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            
            // Hierarchical structure
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('level')->default(0); // 0 = Category, 1 = SubCategory, 2 = Final Category
            $table->integer('sort_order')->default(0);
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('parent_id')->references('id')->on('categories')->onDelete('cascade');
            
            // Indexes for better performance
            $table->index(['parent_id', 'level']);
            $table->index('level');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
}; 