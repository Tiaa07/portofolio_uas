<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $portfolios = Order::with([
                'template',
                'portfolioProfile',
                'portfolioLink',
            ])
            ->where('user_id', $request->user()->id)
            ->where('status_pesanan', 'selesai')
            ->where('status_pembayaran', 'lunas')
            ->whereHas('portfolioLink', function ($query) {
                $query->where('is_active', true);
            })
            ->orderBy('updated_at', 'desc')
            ->get();

        $data = $portfolios->map(function ($order) {
            return [
                'id' => $order->id,
                'kode_order' => $order->kode_order,
                'template' => [
                    'id' => $order->template->id,
                    'nama_template' => $order->template->nama_template,
                    'kategori' => $order->template->kategori,
                    'preview_gambar' => $order->template->preview_gambar,
                ],
                'paket' => $order->paket,
                'status_pesanan' => $order->status_pesanan,
                'status_pembayaran' => $order->status_pembayaran,
                'nama_lengkap' => $order->portfolioProfile->nama_lengkap ?? null,
                'profesi' => $order->portfolioProfile->profesi ?? null,
                'portfolio_link' => [
                    'slug' => $order->portfolioLink->slug,
                    'url_final' => $order->portfolioLink->url_final,
                    'is_active' => $order->portfolioLink->is_active,
                    'diaktifkan_pada' => $order->portfolioLink->diaktifkan_pada,
                ],
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ];
        });

        return ApiResponse::success($data, 'Data portfolio saya berhasil diambil.');
    }

    public function show(Request $request, $id)
    {
        $order = Order::with([
                'template',
                'portfolioProfile',
                'skills',
                'tools',
                'projects',
                'educations',
                'experiences',
                'certificates',
                'achievements',
                'payment',
                'portfolioLink',
            ])
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->where('status_pesanan', 'selesai')
            ->where('status_pembayaran', 'lunas')
            ->whereHas('portfolioLink', function ($query) {
                $query->where('is_active', true);
            })
            ->first();

        if (!$order) {
            return ApiResponse::error('Portfolio tidak ditemukan atau belum selesai.', 404);
        }

        return ApiResponse::success([
            'order' => [
                'id' => $order->id,
                'kode_order' => $order->kode_order,
                'paket' => $order->paket,
                'status_pesanan' => $order->status_pesanan,
                'status_pembayaran' => $order->status_pembayaran,
            ],
            'template' => $order->template,
            'portfolio_profile' => $order->portfolioProfile,
            'skills' => $order->skills,
            'tools' => $order->tools,
            'projects' => $order->projects,
            'educations' => $order->educations,
            'experiences' => $order->experiences,
            'certificates' => $order->certificates,
            'achievements' => $order->achievements,
            'portfolio_link' => $order->portfolioLink,
        ], 'Detail portfolio saya berhasil diambil.');
    }
}