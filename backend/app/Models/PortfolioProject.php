<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        if (!$value) return $value;
        return preg_replace('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/storage\//', '', $value);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}