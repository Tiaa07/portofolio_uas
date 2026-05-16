<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioEducation extends Model
{
    use HasFactory;

    protected $table = 'portfolio_educations';

    protected $fillable = [
        'order_id',
        'nama_sekolah',
        'jurusan',
        'tahun_mulai',
        'tahun_selesai',
        'deskripsi',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}