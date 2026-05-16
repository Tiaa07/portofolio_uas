<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioLink extends Model
{
    use HasFactory;

    protected $table = 'portfolio_links';

    protected $fillable = [
        'order_id',
        'slug',
        'url_final',
        'is_active',
        'diaktifkan_oleh',
        'diaktifkan_pada',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'diaktifkan_pada' => 'datetime',
    ];

    public function getUrlFinalAttribute($value)
    {
        if (!$value) return $value;
        return preg_replace('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/', '', $value);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function activator()
    {
        return $this->belongsTo(User::class, 'diaktifkan_oleh');
    }

    public function isActive(): bool
    {
        return $this->is_active === true;
    }
}