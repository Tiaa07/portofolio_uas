<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        if (!$value) return null;

        // Jika sudah berupa full URL yang valid (bukan localhost)
        if (preg_match('/^https?:\/\//', $value)) {
            // Jika URL mengandung localhost → ganti dengan domain hosting
            if (preg_match('/localhost|127\.0\.0\.1/', $value)) {
                $path = preg_replace('/^https?:\/\/[^\/]+\/storage\//', '', $value);
                return rtrim(config('app.url'), '/') . '/media/' . $path;
            }
            return $value;
        }

        // Path relatif → buat full URL
        $cleaned = ltrim($value, '/');
        return rtrim(config('app.url'), '/') . '/media/' . $cleaned;
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