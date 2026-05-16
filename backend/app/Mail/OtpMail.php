<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $kodeOtp;
    public $expiredAt;

    public function __construct(User $user, string $kodeOtp, $expiredAt)
    {
        $this->user = $user;
        $this->kodeOtp = $kodeOtp;
        $this->expiredAt = $expiredAt;
    }

    public function build()
    {
        return $this
            ->subject('Kode OTP Verifikasi Build Portfolio')
            ->view('emails.otp');
    }
}