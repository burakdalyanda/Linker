<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTokenColsToSocialProfilesTable extends Migration
{
    public function up()
    {
        Schema::table('social_profiles', function (Blueprint $table) {
            $table->string('access_token')->nullable();
            $table->string('refresh_token')->nullable();
            $table->timestamp('access_expires_at')->nullable();
        });
    }

    public function down()
    {
        //
    }
}
