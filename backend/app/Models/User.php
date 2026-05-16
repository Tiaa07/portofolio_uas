<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function adminNotes()
    {
        return $this->hasMany(AdminNote::class, 'admin_id');
    }

    public function paymentsVerified()
    {
        return $this->hasMany(Payment::class, 'diverifikasi_oleh');
    }

    public function portfolioLinksActivated()
    {
        return $this->hasMany(PortfolioLink::class, 'diaktifkan_oleh');
    }

    public function otpCodes()
    {
        return $this->hasMany(OtpCode::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function isActive(): bool
    {
        return $this->status === 'aktif';
    }
}