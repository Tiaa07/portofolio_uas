<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_template',
        'kategori',
        'deskripsi',
        'preview_gambar',
        'demo_link',
        'harga_basic',
        'harga_standard',
        'harga_premium',
        'status',
    ];

    public function getPreviewGambarAttribute($value)
    {
        if (!$value) return $value;
        return preg_replace('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/storage\//', '', $value);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'aktif';
    }

    public function getHargaByPaket(string $paket): ?int
    {
        return match ($paket) {
            'basic' => $this->harga_basic,
            'standard' => $this->harga_standard,
            'premium' => $this->harga_premium,
            default => null,
        };
    }
}