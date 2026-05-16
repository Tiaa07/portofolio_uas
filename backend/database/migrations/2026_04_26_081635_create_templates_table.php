<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('nama_template');
            $table->string('kategori');
            $table->text('deskripsi');
            $table->string('preview_gambar')->nullable();
            $table->string('demo_link')->nullable();

            $table->integer('harga_basic');
            $table->integer('harga_standard');
            $table->integer('harga_premium');

            $table->string('status')->default('aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};