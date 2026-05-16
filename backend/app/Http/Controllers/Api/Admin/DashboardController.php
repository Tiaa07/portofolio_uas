<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PortfolioLink;
use App\Models\Template;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $summary = [
            'users' => [
                'total_user' => User::where('role', 'user')->count(),
                'user_aktif' => User::where('role', 'user')->where('status', 'aktif')->count(),
                'user_nonaktif' => User::where('role', 'user')->where('status', 'nonaktif')->count(),
            ],

            'templates' => [
                'total_template' => Template::count(),
                'template_aktif' => Template::where('status', 'aktif')->count(),
                'template_nonaktif' => Template::where('status', 'nonaktif')->count(),
            ],

            'orders' => [
                'total_order' => Order::count(),
                'pending' => Order::where('status_pesanan', 'pending')->count(),
                'diproses' => Order::where('status_pesanan', 'diproses')->count(),
                'selesai' => Order::where('status_pesanan', 'selesai')->count(),
                'ditolak' => Order::where('status_pesanan', 'ditolak')->count(),
            ],

            'payments' => [
                'menunggu_verifikasi' => Order::where('status_pembayaran', 'menunggu_verifikasi')->count(),
                'lunas' => Order::where('status_pembayaran', 'lunas')->count(),
                'ditolak' => Order::where('status_pembayaran', 'ditolak')->count(),
                'belum_bayar' => Order::where('status_pembayaran', 'belum_bayar')->count(),
            ],

            'portfolios' => [
                'total_link_portfolio' => PortfolioLink::count(),
                'portfolio_aktif' => PortfolioLink::where('is_active', true)->count(),
                'portfolio_nonaktif' => PortfolioLink::where('is_active', false)->count(),
            ],
        ];

        $orderTerbaru = Order::with([
                'user',
                'template',
                'payment',
                'portfolioLink',
            ])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $pembayaranMenunggu = Order::with([
                'user',
                'template',
                'payment',
            ])
            ->where('status_pembayaran', 'menunggu_verifikasi')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $portfolioTerbaru = PortfolioLink::with([
                'order.user',
                'order.template',
                'order.portfolioProfile',
            ])
            ->where('is_active', true)
            ->orderBy('diaktifkan_pada', 'desc')
            ->limit(5)
            ->get();

        return ApiResponse::success([
            'summary' => $summary,
            'order_terbaru' => $orderTerbaru,
            'pembayaran_menunggu_verifikasi' => $pembayaranMenunggu,
            'portfolio_terbaru' => $portfolioTerbaru,
        ], 'Dashboard admin berhasil diambil.');
    }
}