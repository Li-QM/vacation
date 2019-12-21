<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddPropertyToStatusOfCalendar extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */

    public function up()
    {
            //
        DB::statement("ALTER TABLE calendar MODIFY COLUMN status ENUM('Available', 'Not available', 'Reserved', 'Blocked')");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
