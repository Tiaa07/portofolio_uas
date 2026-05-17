<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PortfolioProfile extends Model
{
    use HasFactory;

    protected $table = 'portfolio_profiles';

    protected $fillable = [
        'order_id',
        'nama_lengkap',
        'profesi',
        'email',
        'nomor_hp',
        'foto_profil',
        'about_me',
        'instagram',
        'linkedin',
        'github',
        'website',
    ];

    public function getFotoProfilAttribute($value)
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
}