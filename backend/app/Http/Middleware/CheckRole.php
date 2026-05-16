<?php

namespace App\Http\Middleware;

use App\Helpers\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (!$user) {
            return ApiResponse::error('Unauthenticated.', 401);
        }

        if ($user->role !== $role) {
            return ApiResponse::error('Akses ditolak. Role tidak sesuai.', 403);
        }

        if ($user->status !== 'aktif') {
            return ApiResponse::error('Akun tidak aktif.', 403);
        }

        return $next($request);
    }
}