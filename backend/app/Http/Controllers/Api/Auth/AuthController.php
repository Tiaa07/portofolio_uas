<?php

namespace App\Http\Controllers\Api\Auth;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\OtpCode;
use App\Models\User;
use App\Mail\OtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.min' => 'Nama minimal 3 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal', 422, $validator->errors());
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'status' => 'aktif',
        ]);

        return ApiResponse::success([
            'user' => $user,
        ], 'Registrasi berhasil. Silakan login.', 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal', 422, $validator->errors());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return ApiResponse::error('Email atau password salah.', 401);
        }

        if (!$user->isActive()) {
            return ApiResponse::error('Akun tidak aktif.', 403);
        }

        if ($user->isAdmin()) {
            $token = $user->createToken('admin-token')->plainTextToken;

            return ApiResponse::success([
                'user' => $user,
                'role' => $user->role,
                'token' => $token,
                'token_type' => 'Bearer',
            ], 'Login admin berhasil.');
        }

        $kodeOtp = random_int(100000, 999999);

        OtpCode::where('user_id', $user->id)
            ->whereNull('used_at')
            ->delete();

        $otp = OtpCode::create([
            'user_id' => $user->id,
            'kode_otp' => (string) $kodeOtp,
            'expired_at' => now()->addMinutes(5),
            'used_at' => null,
        ]);

        try {
            Mail::to($user->email)->send(
                new OtpMail($user, $otp->kode_otp, $otp->expired_at)
            );
        } catch (\Throwable $e) {
            return ApiResponse::error('Gagal mengirim kode OTP ke email.', 500, [
                'error' => $e->getMessage(),
            ]);
        }

        return ApiResponse::success([
            'email' => $user->email,
            'role' => $user->role,
            'expired_at' => $otp->expired_at,
        ], 'Login berhasil. Kode OTP sudah dikirim ke email.');
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'kode_otp' => ['required', 'digits:6'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'kode_otp.required' => 'Kode OTP wajib diisi.',
            'kode_otp.digits' => 'Kode OTP harus 6 digit.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal', 422, $validator->errors());
        }

        $user = User::where('email', $request->email)
            ->where('role', 'user')
            ->first();

        if (!$user) {
            return ApiResponse::error('User tidak ditemukan.', 404);
        }

        if (!$user->isActive()) {
            return ApiResponse::error('Akun tidak aktif.', 403);
        }

        $otp = OtpCode::where('user_id', $user->id)
            ->where('kode_otp', $request->kode_otp)
            ->whereNull('used_at')
            ->latest()
            ->first();

        if (!$otp) {
            return ApiResponse::error('Kode OTP salah atau sudah digunakan.', 401);
        }

        if ($otp->isExpired()) {
            return ApiResponse::error('Kode OTP sudah expired.', 401);
        }

        $otp->update([
            'used_at' => now(),
        ]);

        $token = $user->createToken('user-token')->plainTextToken;

        return ApiResponse::success([
            'user' => $user,
            'role' => $user->role,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Verifikasi OTP berhasil. Login user berhasil.');
    }

    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal', 422, $validator->errors());
        }

        $user = User::where('email', $request->email)
            ->where('role', 'user')
            ->first();

        if (!$user) {
            return ApiResponse::error('User tidak ditemukan.', 404);
        }

        if (!$user->isActive()) {
            return ApiResponse::error('Akun tidak aktif.', 403);
        }

        $kodeOtp = random_int(100000, 999999);

        OtpCode::where('user_id', $user->id)
            ->whereNull('used_at')
            ->delete();

        $otp = OtpCode::create([
            'user_id' => $user->id,
            'kode_otp' => (string) $kodeOtp,
            'expired_at' => now()->addMinutes(5),
            'used_at' => null,
        ]);

        try {
            Mail::to($user->email)->send(
                new OtpMail($user, $otp->kode_otp, $otp->expired_at)
            );
        } catch (\Throwable $e) {
            return ApiResponse::error('Gagal mengirim ulang kode OTP ke email.', 500, [
                'error' => $e->getMessage(),
            ]);
        }

        return ApiResponse::success([
            'email' => $user->email,
            'role' => $user->role,
            'expired_at' => $otp->expired_at,
        ], 'Kode OTP baru sudah dikirim ke email.');
    }
    
    public function me(Request $request)
    {
        return ApiResponse::success([
            'user' => $request->user(),
        ], 'Data user berhasil diambil.');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(null, 'Logout berhasil.');
    }
}