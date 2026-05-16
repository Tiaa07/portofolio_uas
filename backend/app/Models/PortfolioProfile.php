<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        if (!$value) return $value;
        return preg_replace('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/storage\//', '', $value);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}