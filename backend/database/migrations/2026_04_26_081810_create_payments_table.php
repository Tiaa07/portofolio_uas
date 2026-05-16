<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->unique()
                ->constrained('orders')
                ->cascadeOnDelete();

            $table->string('metode_pembayaran');
            $table->string('bank_atau_ewallet_pengirim');
            $table->string('nomor_pengirim');
            $table->string('nama_pengirim');
            $table->integer('jumlah_pembayaran');
            $table->date('tanggal_pembayaran');
            $table->string('foto_bukti_pembayaran');

            $table->string('status')->default('menunggu_verifikasi');

            $table->foreignId('diverifikasi_oleh')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('diverifikasi_pada')->nullable();
            $table->text('alasan_penolakan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};