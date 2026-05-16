<?php

namespace App\Http\Controllers\Api\Public;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index()
    {
        $templates = Template::query()
            ->where('status', 'aktif')
            ->orderBy('id', 'asc')
            ->get();

        return ApiResponse::success($templates, 'Daftar template berhasil diambil');
    }

    public function show($id)
    {
        $template = Template::query()
            ->where('status', 'aktif')
            ->where('id', $id)
            ->first();

        if (!$template) {
            return ApiResponse::error('Template tidak ditemukan', 404);
        }

        return ApiResponse::success($template, 'Detail template berhasil diambil');
    }

    public function search(Request $request)
    {
        $keyword = $request->query('keyword');

        if (!$keyword) {
            return ApiResponse::error('Keyword pencarian wajib diisi', 422);
        }

        $templates = Template::query()
            ->where('status', 'aktif')
            ->where(function ($query) use ($keyword) {
                $query->where('nama_template', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('kategori', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('deskripsi', 'LIKE', '%' . $keyword . '%');
            })
            ->orderBy('id', 'asc')
            ->get();

        return ApiResponse::success($templates, 'Hasil pencarian template berhasil diambil');
    }
}