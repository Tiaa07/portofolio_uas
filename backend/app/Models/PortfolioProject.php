<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PortfolioProject extends Model
{
    use HasFactory;

    protected $table = 'portfolio_projects';
    
    protected $fillable = [
        'order_id',
        'nama_project',
        'deskripsi_project',
        'link_project',
        'gambar_project',
    ];

    public function getGambarProjectAttribute($value)
    {
        if (!$value) return null;

        if (preg_match('/^https?:\/\//', $value)) {
            if (preg_match('/localhost|127\.0\.0\.1/', $value)) {
                $path = preg_replace('/^https?:\/\/[^\/]+\/storage\//', '', $value);
                return rtrim(config('app.url'), '/') . '/storage/' . $path;
            }
            return $value;
        }

        $cleaned = ltrim($value, '/');
        return rtrim(config('app.url'), '/') . '/storage/' . $cleaned;
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}