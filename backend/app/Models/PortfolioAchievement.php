<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioAchievement extends Model
{
    use HasFactory;

    protected $table = 'portfolio_achievements';

    protected $fillable = [
        'order_id',
        'nama_pencapaian',
        'deskripsi',
        'tahun',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}