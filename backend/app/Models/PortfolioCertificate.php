<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioCertificate extends Model
{
    use HasFactory;

    protected $table = 'portfolio_certificates';

    protected $fillable = [
        'order_id',
        'nama_sertifikat',
        'penerbit',
        'tahun',
        'file_sertifikat',
    ];

    public function getFileSertifikatAttribute($value)
    {
        if (!$value) return $value;
        return preg_replace('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/storage\//', '', $value);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}