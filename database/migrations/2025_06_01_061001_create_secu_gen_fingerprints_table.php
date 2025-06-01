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
        Schema::create('secu_gen_fingerprints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade')->comment('Foreign key to employees table');
            $table->string('personal_info_id')->nullable()->comment('Personal info ID or UUID');
            $table->string('Manufacturer')->comment('Fingerprint device manufacturer');
            $table->string('Model')->comment('Fingerprint device model');
            $table->string('SerialNumber')->comment('Device serial number');
            $table->integer('ImageWidth')->comment('Fingerprint image width');
            $table->integer('ImageHeight')->comment('Fingerprint image height');
            $table->integer('ImageDPI')->comment('Fingerprint image DPI');
            $table->integer('ImageQuality')->comment('Fingerprint image quality');
            $table->integer('NFIQ')->comment('NIST Fingerprint Image Quality');
            $table->longText('ImageDataBase64')->comment('Base64 encoded fingerprint image data');
            $table->longText('BMPBase64')->comment('Base64 encoded BMP image');
            $table->longText('ISOTemplateBase64')->comment('Base64 encoded ISO template');
            $table->longText('TemplateBase64')->comment('Base64 encoded template');
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index('employee_id');
            $table->index('personal_info_id');
            $table->index(['Manufacturer', 'Model']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secu_gen_fingerprints');
    }
};
