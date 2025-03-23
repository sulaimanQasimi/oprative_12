<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('account_outcomes', function (Blueprint $table) {
            $table->text('description')->nullable()->after('reference_number');
        });
    }

    public function down()
    {
        Schema::table('account_outcomes', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};
