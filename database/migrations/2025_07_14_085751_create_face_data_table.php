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
        Schema::create('face_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->json('face_descriptor'); // Store face descriptor array from face-api.js
            $table->string('encoding_model')->default('ssd_mobilenetv1'); // Track which model was used
            $table->string('image_path')->nullable(); // Optional reference image path
            $table->decimal('confidence_score', 5, 4)->nullable(); // Confidence score for the face detection
            $table->boolean('is_active')->default(true); // Enable/disable face data
            $table->text('notes')->nullable(); // Additional notes
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index('employee_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('face_data');
    }
};
