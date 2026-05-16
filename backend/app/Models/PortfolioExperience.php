<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioExperience extends Model
{
    use HasFactory;

    protected $table = 'portfolio_experiences';

    protected $fillable = [
        'order_id',
        'nama_tempat',
        'posisi',
        'deskripsi',
        'tahun_mulai',
        'tahun_selesai',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}