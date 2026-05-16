<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = Template::query();

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->where('nama_template', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('kategori', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('deskripsi', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('status', 'LIKE', '%' . $keyword . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', 'LIKE', '%' . $request->kategori . '%');
        }

        $templates = $query
            ->withCount('orders')
            ->orderBy('id', 'asc')
            ->get();

        return ApiResponse::success($templates, 'Data template berhasil diambil.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_template' => ['required', 'string', 'max:255', 'unique:templates,nama_template'],
            'kategori' => ['required', 'string', 'max:255'],
            'deskripsi' => ['required', 'string'],
            'preview_gambar' => ['nullable', 'string', 'max:255'],
            'demo_link' => ['nullable', 'url', 'max:255'],
            'harga_basic' => ['required', 'integer', 'min:0'],
            'harga_standard' => ['required', 'integer', 'min:0', 'gt:harga_basic'],
            'harga_premium' => ['required', 'integer', 'min:0', 'gt:harga_standard'],
            'status' => ['required', 'in:aktif,nonaktif'],
        ], [
            'nama_template.required' => 'Nama template wajib diisi.',
            'nama_template.unique' => 'Nama template sudah digunakan.',
            'kategori.required' => 'Kategori wajib diisi.',
            'deskripsi.required' => 'Deskripsi wajib diisi.',
            'demo_link.url' => 'Demo link harus berupa URL yang valid.',
            'harga_basic.required' => 'Harga Basic wajib diisi.',
            'harga_basic.integer' => 'Harga Basic harus berupa angka.',
            'harga_standard.required' => 'Harga Standard wajib diisi.',
            'harga_standard.integer' => 'Harga Standard harus berupa angka.',
            'harga_standard.gt' => 'Harga Standard harus lebih besar dari harga Basic.',
            'harga_premium.required' => 'Harga Premium wajib diisi.',
            'harga_premium.integer' => 'Harga Premium harus berupa angka.',
            'harga_premium.gt' => 'Harga Premium harus lebih besar dari harga Standard.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status harus aktif atau nonaktif.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal.', 422, $validator->errors());
        }

        $template = Template::create([
            'nama_template' => $request->nama_template,
            'kategori' => $request->kategori,
            'deskripsi' => $request->deskripsi,
            'preview_gambar' => $request->preview_gambar,
            'demo_link' => $request->demo_link,
            'harga_basic' => $request->harga_basic,
            'harga_standard' => $request->harga_standard,
            'harga_premium' => $request->harga_premium,
            'status' => $request->status,
        ]);

        return ApiResponse::success($template, 'Template berhasil ditambahkan.', 201);
    }

    public function show($id)
    {
        $template = Template::withCount('orders')->find($id);

        if (!$template) {
            return ApiResponse::error('Template tidak ditemukan.', 404);
        }

        return ApiResponse::success($template, 'Detail template berhasil diambil.');
    }

    public function update(Request $request, $id)
    {
        $template = Template::find($id);

        if (!$template) {
            return ApiResponse::error('Template tidak ditemukan.', 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_template' => ['required', 'string', 'max:255', 'unique:templates,nama_template,' . $template->id],
            'kategori' => ['required', 'string', 'max:255'],
            'deskripsi' => ['required', 'string'],
            'preview_gambar' => ['nullable', 'string', 'max:255'],
            'demo_link' => ['nullable', 'url', 'max:255'],
            'harga_basic' => ['required', 'integer', 'min:0'],
            'harga_standard' => ['required', 'integer', 'min:0', 'gt:harga_basic'],
            'harga_premium' => ['required', 'integer', 'min:0', 'gt:harga_standard'],
            'status' => ['required', 'in:aktif,nonaktif'],
        ], [
            'nama_template.required' => 'Nama template wajib diisi.',
            'nama_template.unique' => 'Nama template sudah digunakan.',
            'kategori.required' => 'Kategori wajib diisi.',
            'deskripsi.required' => 'Deskripsi wajib diisi.',
            'demo_link.url' => 'Demo link harus berupa URL yang valid.',
            'harga_basic.required' => 'Harga Basic wajib diisi.',
            'harga_basic.integer' => 'Harga Basic harus berupa angka.',
            'harga_standard.required' => 'Harga Standard wajib diisi.',
            'harga_standard.integer' => 'Harga Standard harus berupa angka.',
            'harga_standard.gt' => 'Harga Standard harus lebih besar dari harga Basic.',
            'harga_premium.required' => 'Harga Premium wajib diisi.',
            'harga_premium.integer' => 'Harga Premium harus berupa angka.',
            'harga_premium.gt' => 'Harga Premium harus lebih besar dari harga Standard.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status harus aktif atau nonaktif.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal.', 422, $validator->errors());
        }

        $template->update([
            'nama_template' => $request->nama_template,
            'kategori' => $request->kategori,
            'deskripsi' => $request->deskripsi,
            'preview_gambar' => $request->preview_gambar,
            'demo_link' => $request->demo_link,
            'harga_basic' => $request->harga_basic,
            'harga_standard' => $request->harga_standard,
            'harga_premium' => $request->harga_premium,
            'status' => $request->status,
        ]);

        return ApiResponse::success($template, 'Template berhasil diperbarui.');
    }

    public function toggleStatus($id)
    {
        $template = Template::find($id);

        if (!$template) {
            return ApiResponse::error('Template tidak ditemukan.', 404);
        }

        $template->update([
            'status' => $template->status === 'aktif' ? 'nonaktif' : 'aktif',
        ]);

        return ApiResponse::success($template, 'Status template berhasil diubah.');
    }

    public function destroy($id)
    {
        $template = Template::withCount('orders')->find($id);

        if (!$template) {
            return ApiResponse::error('Template tidak ditemukan.', 404);
        }

        if ($template->orders_count > 0) {
            return ApiResponse::error(
                'Template sudah pernah digunakan pada pesanan, jadi tidak boleh dihapus. Nonaktifkan template saja.',
                422
            );
        }

        $template->delete();

        return ApiResponse::success(null, 'Template berhasil dihapus.');
    }
}