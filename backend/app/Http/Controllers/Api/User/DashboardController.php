<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PortfolioLink;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $summary = [
            'welcome' => 'Selamat datang, ' . $user->name . '!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
            ],

            'orders' => [
                'total_pesanan' => Order::where('user_id', $user->id)->count(),
                'pending' => Order::where('user_id', $user->id)->where('status_pesanan', 'pending')->count(),
                'diproses' => Order::where('user_id', $user->id)->where('status_pesanan', 'diproses')->count(),
                'selesai' => Order::where('user_id', $user->id)->where('status_pesanan', 'selesai')->count(),
                'ditolak' => Order::where('user_id', $user->id)->where('status_pesanan', 'ditolak')->count(),
            ],

            'payments' => [
                'menunggu_verifikasi' => Order::where('user_id', $user->id)->where('status_pembayaran', 'menunggu_verifikasi')->count(),
                'lunas' => Order::where('user_id', $user->id)->where('status_pembayaran', 'lunas')->count(),
                'ditolak' => Order::where('user_id', $user->id)->where('status_pembayaran', 'ditolak')->count(),
                'belum_bayar' => Order::where('user_id', $user->id)->where('status_pembayaran', 'belum_bayar')->count(),
            ],

            'portfolios' => [
                'total_portfolio_selesai' => Order::where('user_id', $user->id)
                    ->where('status_pesanan', 'selesai')
                    ->where('status_pembayaran', 'lunas')
                    ->whereHas('portfolioLink', function ($query) {
                        $query->where('is_active', true);
                    })
                    ->count(),
            ],
        ];

        $orderTerbaru = Order::with([
                'template',
                'payment',
                'portfolioLink',
            ])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $portfolioTerbaru = PortfolioLink::with([
                'order.template',
                'order.portfolioProfile',
            ])
            ->whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('status_pesanan', 'selesai')
                    ->where('status_pembayaran', 'lunas');
            })
            ->where('is_active', true)
            ->orderBy('diaktifkan_pada', 'desc')
            ->limit(5)
            ->get();

        return ApiResponse::success([
            'summary' => $summary,
            'order_terbaru' => $orderTerbaru,
            'portfolio_terbaru' => $portfolioTerbaru,
        ], 'Dashboard user berhasil diambil.');
    }
}