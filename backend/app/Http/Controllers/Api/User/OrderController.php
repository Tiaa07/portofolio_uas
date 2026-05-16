<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PortfolioAchievement;
use App\Models\PortfolioCertificate;
use App\Models\PortfolioEducation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioSkill;
use App\Models\PortfolioTool;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with([
                'template',
                'payment',
                'portfolioLink',
            ])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::success($orders, 'Data pesanan berhasil diambil.');
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
                'adminNotes.admin',
                'portfolioLink',
            ])
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$order) {
            return ApiResponse::error('Pesanan tidak ditemukan.', 404);
        }

        return ApiResponse::success($order, 'Detail pesanan berhasil diambil.');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'template_id' => ['required', 'exists:templates,id'],
            'paket' => ['required', 'in:basic,standard,premium'],

            'nama_lengkap' => ['required', 'string', 'min:3', 'max:255'],
            'profesi' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'nomor_hp' => ['required', 'string', 'max:20'],
            'foto_profil' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            'instagram' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'github' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],

            'about_me' => ['nullable', 'string'],

            'skills' => ['nullable', 'string'],
            'tools' => ['nullable', 'string'],
            'projects' => ['nullable', 'string'],
            'educations' => ['nullable', 'string'],
            'experiences' => ['nullable', 'string'],
            'certificates' => ['nullable', 'string'],
            'achievements' => ['nullable', 'string'],

            'project_images' => ['nullable', 'array'],
            'project_images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            'certificate_files' => ['nullable', 'array'],
            'certificate_files.*' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],

            'metode_pembayaran' => ['required', 'string', 'max:255'],
            'bank_atau_ewallet_pengirim' => ['required', 'string', 'max:255'],
            'nomor_pengirim' => ['required', 'string', 'max:255'],
            'nama_pengirim' => ['required', 'string', 'max:255'],
            'jumlah_pembayaran' => ['required', 'integer', 'min:1'],
            'tanggal_pembayaran' => ['required', 'date'],
            'foto_bukti_pembayaran' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ], [
            'template_id.required' => 'Template wajib dipilih.',
            'template_id.exists' => 'Template tidak ditemukan.',
            'paket.required' => 'Paket wajib dipilih.',
            'paket.in' => 'Paket harus basic, standard, atau premium.',

            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nama_lengkap.min' => 'Nama lengkap minimal 3 karakter.',
            'profesi.required' => 'Profesi wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'nomor_hp.required' => 'Nomor HP wajib diisi.',
            'foto_profil.required' => 'Foto profil wajib diupload.',
            'foto_profil.image' => 'Foto profil harus berupa gambar.',
            'foto_profil.mimes' => 'Foto profil harus JPG, JPEG, atau PNG.',
            'foto_profil.max' => 'Foto profil maksimal 2 MB.',

            'metode_pembayaran.required' => 'Metode pembayaran wajib dipilih.',
            'bank_atau_ewallet_pengirim.required' => 'Bank atau e-wallet pengirim wajib diisi.',
            'nomor_pengirim.required' => 'Nomor rekening atau e-wallet pengirim wajib diisi.',
            'nama_pengirim.required' => 'Nama pengirim wajib diisi.',
            'jumlah_pembayaran.required' => 'Jumlah pembayaran wajib diisi.',
            'jumlah_pembayaran.integer' => 'Jumlah pembayaran harus berupa angka.',
            'tanggal_pembayaran.required' => 'Tanggal pembayaran wajib diisi.',
            'foto_bukti_pembayaran.required' => 'Foto bukti pembayaran wajib diupload.',
            'foto_bukti_pembayaran.image' => 'Foto bukti pembayaran harus berupa gambar.',
            'foto_bukti_pembayaran.mimes' => 'Foto bukti pembayaran harus JPG, JPEG, atau PNG.',
            'foto_bukti_pembayaran.max' => 'Foto bukti pembayaran maksimal 2 MB.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal.', 422, $validator->errors());
        }

        $template = Template::where('id', $request->template_id)
            ->where('status', 'aktif')
            ->first();

        if (!$template) {
            return ApiResponse::error('Template tidak ditemukan atau sedang tidak aktif.', 404);
        }

        $hargaPaket = $template->getHargaByPaket($request->paket);

        if ($hargaPaket === null) {
            return ApiResponse::error('Paket tidak valid.', 422);
        }

        if ((int) $request->jumlah_pembayaran !== (int) $hargaPaket) {
            return ApiResponse::error('Jumlah pembayaran harus sesuai dengan harga paket.', 422, [
                'harga_paket' => $hargaPaket,
                'jumlah_dibayar' => (int) $request->jumlah_pembayaran,
            ]);
        }

        $skills = $this->decodeJsonArray($request->skills, 'skills');
        if ($skills['error']) {
            return ApiResponse::error($skills['message'], 422);
        }

        $tools = $this->decodeJsonArray($request->tools, 'tools');
        if ($tools['error']) {
            return ApiResponse::error($tools['message'], 422);
        }

        $projects = $this->decodeJsonArray($request->projects, 'projects');
        if ($projects['error']) {
            return ApiResponse::error($projects['message'], 422);
        }

        $educations = $this->decodeJsonArray($request->educations, 'educations');
        if ($educations['error']) {
            return ApiResponse::error($educations['message'], 422);
        }

        $experiences = $this->decodeJsonArray($request->experiences, 'experiences');
        if ($experiences['error']) {
            return ApiResponse::error($experiences['message'], 422);
        }

        $certificates = $this->decodeJsonArray($request->certificates, 'certificates');
        if ($certificates['error']) {
            return ApiResponse::error($certificates['message'], 422);
        }

        $achievements = $this->decodeJsonArray($request->achievements, 'achievements');
        if ($achievements['error']) {
            return ApiResponse::error($achievements['message'], 422);
        }

        $packageValidation = $this->validatePackageData(
            $request,
            $skills['data'],
            $tools['data'],
            $projects['data'],
            $educations['data']
        );

        if ($packageValidation !== true) {
            return $packageValidation;
        }

        try {
            DB::beginTransaction();

            $fotoProfilPath = $request->file('foto_profil')->store('portfolio/foto-profil', 'public');
            $fotoBuktiPath = $request->file('foto_bukti_pembayaran')->store('payments/bukti-pembayaran', 'public');

            $order = Order::create([
                'kode_order' => $this->generateOrderCode(),
                'user_id' => $request->user()->id,
                'template_id' => $template->id,
                'paket' => $request->paket,
                'harga_paket' => $hargaPaket,
                'status_pesanan' => 'pending',
                'status_pembayaran' => 'menunggu_verifikasi',
                'catatan_admin' => null,
            ]);

            PortfolioProfile::create([
                'order_id' => $order->id,
                'nama_lengkap' => $request->nama_lengkap,
                'profesi' => $request->profesi,
                'email' => $request->email,
                'nomor_hp' => $request->nomor_hp,
                'foto_profil' => $fotoProfilPath,
                'about_me' => in_array($request->paket, ['standard', 'premium']) ? $request->about_me : null,
                'instagram' => $request->instagram,
                'linkedin' => $request->linkedin,
                'github' => $request->github,
                'website' => $request->website,
            ]);

            if (in_array($request->paket, ['standard', 'premium'])) {
                foreach ($skills['data'] as $skill) {
                    PortfolioSkill::create([
                        'order_id' => $order->id,
                        'nama_skill' => $skill['nama_skill'] ?? $skill['name'] ?? null,
                        'level_skill' => $skill['level_skill'] ?? $skill['level'] ?? null,
                    ]);
                }

                foreach ($tools['data'] as $tool) {
                    PortfolioTool::create([
                        'order_id' => $order->id,
                        'nama_tools' => $tool['nama_tools'] ?? $tool['name'] ?? null,
                    ]);
                }
            }

            if ($request->paket === 'premium') {
                $projectImages = $request->file('project_images', []);

                foreach ($projects['data'] as $index => $project) {
                    $gambarProjectPath = null;

                    if (isset($projectImages[$index])) {
                        $gambarProjectPath = $projectImages[$index]->store('portfolio/foto-profil', 'public');
                    }

                    PortfolioProject::create([
                        'order_id' => $order->id,
                        'nama_project' => $project['nama_project'] ?? $project['name'] ?? null,
                        'deskripsi_project' => $project['deskripsi_project'] ?? $project['description'] ?? null,
                        'link_project' => $project['link_project'] ?? $project['link'] ?? null,
                        'gambar_project' => $gambarProjectPath,
                    ]);
                }

                foreach ($educations['data'] as $education) {
                    PortfolioEducation::create([
                        'order_id' => $order->id,
                        'nama_sekolah' => $education['nama_sekolah'] ?? $education['school'] ?? null,
                        'jurusan' => $education['jurusan'] ?? $education['major'] ?? null,
                        'tahun_mulai' => $education['tahun_mulai'] ?? $education['start_year'] ?? null,
                        'tahun_selesai' => $education['tahun_selesai'] ?? $education['end_year'] ?? null,
                        'deskripsi' => $education['deskripsi'] ?? $education['description'] ?? null,
                    ]);
                }

                foreach ($experiences['data'] as $experience) {
                    PortfolioExperience::create([
                        'order_id' => $order->id,
                        'nama_tempat' => $experience['nama_tempat'] ?? $experience['company'] ?? null,
                        'posisi' => $experience['posisi'] ?? $experience['position'] ?? null,
                        'deskripsi' => $experience['deskripsi'] ?? $experience['description'] ?? null,
                        'tahun_mulai' => $experience['tahun_mulai'] ?? $experience['start_year'] ?? null,
                        'tahun_selesai' => $experience['tahun_selesai'] ?? $experience['end_year'] ?? null,
                    ]);
                }

                $certificateFiles = $request->file('certificate_files', []);

                foreach ($certificates['data'] as $index => $certificate) {
                    $fileSertifikatPath = null;

                    if (isset($certificateFiles[$index])) {
                        $fileSertifikatPath = $certificateFiles[$index]->store('portfolio/foto-profil', 'public');
                    }

                    PortfolioCertificate::create([
                        'order_id' => $order->id,
                        'nama_sertifikat' => $certificate['nama_sertifikat'] ?? $certificate['name'] ?? null,
                        'penerbit' => $certificate['penerbit'] ?? $certificate['issuer'] ?? null,
                        'tahun' => $certificate['tahun'] ?? $certificate['year'] ?? null,
                        'file_sertifikat' => $fileSertifikatPath,
                    ]);
                }

                foreach ($achievements['data'] as $achievement) {
                    PortfolioAchievement::create([
                        'order_id' => $order->id,
                        'nama_pencapaian' => $achievement['nama_pencapaian'] ?? $achievement['name'] ?? null,
                        'deskripsi' => $achievement['deskripsi'] ?? $achievement['description'] ?? null,
                        'tahun' => $achievement['tahun'] ?? $achievement['year'] ?? null,
                    ]);
                }
            }

            Payment::create([
                'order_id' => $order->id,
                'metode_pembayaran' => $request->metode_pembayaran,
                'bank_atau_ewallet_pengirim' => $request->bank_atau_ewallet_pengirim,
                'nomor_pengirim' => $request->nomor_pengirim,
                'nama_pengirim' => $request->nama_pengirim,
                'jumlah_pembayaran' => $request->jumlah_pembayaran,
                'tanggal_pembayaran' => $request->tanggal_pembayaran,
                'foto_bukti_pembayaran' => $fotoBuktiPath,
                'status' => 'menunggu_verifikasi',
                'diverifikasi_oleh' => null,
                'diverifikasi_pada' => null,
                'alasan_penolakan' => null,
            ]);

            DB::commit();

            $order->load([
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
            ]);

            return ApiResponse::success($order, 'Pesanan berhasil dibuat. Pembayaran menunggu verifikasi admin.', 201);
        } catch (\Throwable $e) {
            DB::rollBack();

            return ApiResponse::error('Pesanan gagal dibuat.', 500, [
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function uploadPaymentProof(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'metode_pembayaran' => ['required', 'string', 'max:255'],
            'bank_atau_ewallet_pengirim' => ['required', 'string', 'max:255'],
            'nomor_pengirim' => ['required', 'string', 'max:255'],
            'nama_pengirim' => ['required', 'string', 'max:255'],
            'jumlah_pembayaran' => ['required', 'integer', 'min:1'],
            'tanggal_pembayaran' => ['required', 'date'],
            'foto_bukti_pembayaran' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ], [
            'metode_pembayaran.required' => 'Metode pembayaran wajib dipilih.',
            'bank_atau_ewallet_pengirim.required' => 'Bank atau e-wallet pengirim wajib diisi.',
            'nomor_pengirim.required' => 'Nomor rekening atau e-wallet pengirim wajib diisi.',
            'nama_pengirim.required' => 'Nama pengirim wajib diisi.',
            'jumlah_pembayaran.required' => 'Jumlah pembayaran wajib diisi.',
            'jumlah_pembayaran.integer' => 'Jumlah pembayaran harus berupa angka.',
            'tanggal_pembayaran.required' => 'Tanggal pembayaran wajib diisi.',
            'foto_bukti_pembayaran.required' => 'Foto bukti pembayaran wajib diupload.',
            'foto_bukti_pembayaran.image' => 'Foto bukti pembayaran harus berupa gambar.',
            'foto_bukti_pembayaran.mimes' => 'Foto bukti pembayaran harus JPG, JPEG, atau PNG.',
            'foto_bukti_pembayaran.max' => 'Foto bukti pembayaran maksimal 2 MB.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal.', 422, $validator->errors());
        }

        $order = Order::with(['payment', 'template'])
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$order) {
            return ApiResponse::error('Pesanan tidak ditemukan.', 404);
        }

        if (!$order->payment) {
            return ApiResponse::error('Data pembayaran tidak ditemukan.', 404);
        }

        if ($order->status_pesanan === 'selesai') {
            return ApiResponse::error('Pesanan sudah selesai, bukti pembayaran tidak bisa diubah.', 422);
        }

        if ($order->status_pembayaran === 'lunas') {
            return ApiResponse::error('Pembayaran sudah lunas, bukti pembayaran tidak bisa diupload ulang.', 422);
        }

        if ($order->status_pembayaran === 'menunggu_verifikasi') {
            return ApiResponse::error('Pembayaran masih menunggu verifikasi admin.', 422);
        }

        if ($order->status_pembayaran !== 'ditolak') {
            return ApiResponse::error('Upload ulang bukti hanya bisa dilakukan jika pembayaran ditolak.', 422);
        }

        if ((int) $request->jumlah_pembayaran !== (int) $order->harga_paket) {
            return ApiResponse::error('Jumlah pembayaran harus sesuai dengan harga paket.', 422, [
                'harga_paket' => $order->harga_paket,
                'jumlah_dibayar' => (int) $request->jumlah_pembayaran,
            ]);
        }

        try {
            DB::beginTransaction();

            $fotoBuktiPath = $request->file('foto_bukti_pembayaran')
                ->store('payments/bukti-pembayaran', 'public');

            $order->payment->update([
                'metode_pembayaran' => $request->metode_pembayaran,
                'bank_atau_ewallet_pengirim' => $request->bank_atau_ewallet_pengirim,
                'nomor_pengirim' => $request->nomor_pengirim,
                'nama_pengirim' => $request->nama_pengirim,
                'jumlah_pembayaran' => $request->jumlah_pembayaran,
                'tanggal_pembayaran' => $request->tanggal_pembayaran,
                'foto_bukti_pembayaran' => $fotoBuktiPath,
                'status' => 'menunggu_verifikasi',
                'diverifikasi_oleh' => null,
                'diverifikasi_pada' => null,
                'alasan_penolakan' => null,
            ]);

            $order->update([
                'status_pembayaran' => 'menunggu_verifikasi',
                'catatan_admin' => null,
            ]);

            DB::commit();

            $order->load([
                'template',
                'portfolioProfile',
                'payment',
                'adminNotes.admin',
            ]);

            return ApiResponse::success(
                $order,
                'Bukti pembayaran berhasil diupload ulang. Pembayaran menunggu verifikasi admin.'
            );
        } catch (\Throwable $e) {
            DB::rollBack();

            return ApiResponse::error('Gagal upload ulang bukti pembayaran.', 500, [
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function decodeJsonArray($value, string $fieldName): array
    {
        if ($value === null || $value === '') {
            return [
                'error' => false,
                'data' => [],
                'message' => null,
            ];
        }

        $decoded = json_decode($value, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return [
                'error' => true,
                'data' => [],
                'message' => "Format {$fieldName} harus berupa JSON array yang valid.",
            ];
        }

        return [
            'error' => false,
            'data' => $decoded,
            'message' => null,
        ];
    }

    private function validatePackageData(Request $request, array $skills, array $tools, array $projects, array $educations)
    {
        if ($request->paket === 'basic') {
            return true;
        }

        if ($request->paket === 'standard') {
            if (!$request->filled('about_me')) {
                return ApiResponse::error('About Me wajib diisi untuk paket Standard.', 422);
            }

            if (count($skills) < 1) {
                return ApiResponse::error('Skills minimal 1 untuk paket Standard.', 422);
            }

            if (count($tools) < 1) {
                return ApiResponse::error('Tools minimal 1 untuk paket Standard.', 422);
            }

            return true;
        }

        if ($request->paket === 'premium') {
            if (!$request->filled('about_me')) {
                return ApiResponse::error('About Me wajib diisi untuk paket Premium.', 422);
            }

            if (count($skills) < 1) {
                return ApiResponse::error('Skills minimal 1 untuk paket Premium.', 422);
            }

            if (count($tools) < 1) {
                return ApiResponse::error('Tools minimal 1 untuk paket Premium.', 422);
            }

            if (count($projects) < 1) {
                return ApiResponse::error('Project minimal 1 untuk paket Premium.', 422);
            }

            if (count($educations) < 1) {
                return ApiResponse::error('Education minimal 1 untuk paket Premium.', 422);
            }

            return true;
        }

        return ApiResponse::error('Paket tidak valid.', 422);
    }

    private function generateOrderCode(): string
    {
        do {
            $code = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
        } while (Order::where('kode_order', $code)->exists());

        return $code;
    }
}
