<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioSkill extends Model
{
    use HasFactory;

    protected $table = 'portfolio_skills';

    protected $fillable = [
        'order_id',
        'nama_skill',
        'level_skill',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}