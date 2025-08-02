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
        // Create customer_transfers table
        Schema::create('customer_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique();
            $table->foreignId('from_customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignId('to_customer_id')->constrained('customers')->cascadeOnDelete();
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('transfer_date');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for better performance
            $table->index(['from_customer_id', 'status']);
            $table->index(['to_customer_id', 'status']);
            $table->index(['created_by', 'transfer_date']);
        });

        // Create customer_transfer_items table
        Schema::create('customer_transfer_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_transfer_id')->constrained('customer_transfers')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('batch_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_price', 10, 2);
            $table->string('unit_type')->default('batch_unit'); // batch_unit, wholesale, retail
            $table->foreignId('unit_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('unit_amount', 10, 2)->default(1);
            $table->string('unit_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for better performance
            $table->index(['customer_transfer_id']);
            $table->index(['product_id', 'batch_id']);
            $table->index(['unit_type', 'unit_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_transfer_items');
        Schema::dropIfExists('customer_transfers');
    }
}; 