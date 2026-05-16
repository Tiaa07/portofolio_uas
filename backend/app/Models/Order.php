<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_order',
        'user_id',
        'template_id',
        'paket',
        'harga_paket',
        'status_pesanan',
        'status_pembayaran',
        'catatan_admin',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function portfolioProfile()
    {
        return $this->hasOne(PortfolioProfile::class);
    }

    public function skills()
    {
        return $this->hasMany(PortfolioSkill::class);
    }

    public function tools()
    {
        return $this->hasMany(PortfolioTool::class);
    }

    public function projects()
    {
        return $this->hasMany(PortfolioProject::class);
    }

    public function educations()
    {
        return $this->hasMany(PortfolioEducation::class);
    }

    public function experiences()
    {
        return $this->hasMany(PortfolioExperience::class);
    }

    public function certificates()
    {
        return $this->hasMany(PortfolioCertificate::class);
    }

    public function achievements()
    {
        return $this->hasMany(PortfolioAchievement::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function adminNotes()
    {
        return $this->hasMany(AdminNote::class);
    }

    public function portfolioLink()
    {
        return $this->hasOne(PortfolioLink::class);
    }

    public function isPaymentWaiting(): bool
    {
        return $this->status_pembayaran === 'menunggu_verifikasi';
    }

    public function isPaid(): bool
    {
        return $this->status_pembayaran === 'lunas';
    }

    public function isPaymentRejected(): bool
    {
        return $this->status_pembayaran === 'ditolak';
    }

    public function isPending(): bool
    {
        return $this->status_pesanan === 'pending';
    }

    public function isProcessing(): bool
    {
        return $this->status_pesanan === 'diproses';
    }

    public function isCompleted(): bool
    {
        return $this->status_pesanan === 'selesai';
    }

    public function isRejected(): bool
    {
        return $this->status_pesanan === 'ditolak';
    }
}