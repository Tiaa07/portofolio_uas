<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'metode_pembayaran',
        'bank_atau_ewallet_pengirim',
        'nomor_pengirim',
        'nama_pengirim',
        'jumlah_pembayaran',
        'tanggal_pembayaran',
        'foto_bukti_pembayaran',
        'status',
        'diverifikasi_oleh',
        'diverifikasi_pada',
        'alasan_penolakan',
    ];

    protected $casts = [
        'tanggal_pembayaran' => 'date',
        'diverifikasi_pada' => 'datetime',
    ];

    public function getFotoBuktiPembayaranAttribute($value)
    {
        if (!$value) return $value;
        return preg_replace('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/storage\//', '', $value);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }

    public function isWaiting(): bool
    {
        return $this->status === 'menunggu_verifikasi';
    }

    public function isPaid(): bool
    {
        return $this->status === 'lunas';
    }

    public function isRejected(): bool
    {
        return $this->status === 'ditolak';
    }
}