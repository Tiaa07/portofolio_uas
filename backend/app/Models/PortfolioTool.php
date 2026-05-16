<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioTool extends Model
{
    use HasFactory;

    protected $table = 'portfolio_tools';

    protected $fillable = [
        'order_id',
        'nama_tools',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}