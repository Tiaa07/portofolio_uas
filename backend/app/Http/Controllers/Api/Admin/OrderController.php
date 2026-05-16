<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\AdminNote;
use App\Models\Order;
use App\Models\PortfolioAchievement;
use App\Models\PortfolioCertificate;
use App\Models\PortfolioEducation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioLink;
use App\Models\PortfolioProject;
use App\Models\PortfolioSkill;
use App\Models\PortfolioTool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with([
                'user',
                'template',
                'payment',
                'portfolioLink',
            ])
            ->withCount([
                'skills',
                'tools',
                'projects',
                'educations',
                'experiences',
                'certificates',
                'achievements',
            ]);

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->where('kode_order', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('paket', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('status_pesanan', 'LIKE', '%' . $keyword . '%')
                    ->orWhere('status_pembayaran', 'LIKE', '%' . $keyword . '%')
                    ->orWhereHas('user', function ($userQuery) use ($keyword) {
                        $userQuery->where('name', 'LIKE', '%' . $keyword . '%')
                            ->orWhere('email', 'LIKE', '%' . $keyword . '%');
                    })
                    ->orWhereHas('template', function ($templateQuery) use ($keyword) {
                        $templateQuery->where('nama_template', 'LIKE', '%' . $keyword . '%')
                            ->orWhere('kategori', 'LIKE', '%' . $keyword . '%');
                    });
            });
        }

        if ($request->filled('status_pesanan')) {
            $query->where('status_pesanan', $request->status_pesanan);
        }

        if ($request->filled('status_pembayaran')) {
            $query->where('status_pembayaran', $request->status_pembayaran);
        }

        if ($request->filled('paket')) {
            $query->where('paket', $request->paket);
        }

        if ($request->filled('template_id')) {
            $query->where('template_id', $request->template_id);
        }

        $orders = $query
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::success($orders, 'Data order masuk berhasil diambil.');
    }

    public function show($id)
    {
        $order = Order::with([
                'user',
                'template',
                'portfolioProfile',
                'skills',
                'tools',
                'projects',
                'educations',
                'experiences',
                'certificates',
                'achievements',
                'payment.verifier',
                'adminNotes.admin',
                'portfolioLink',
            ])
            ->find($id);

        if (!$order) {
            return ApiResponse::error('Order tidak ditemukan.', 404);
        }

        return ApiResponse::success($order, 'Detail order berhasil diambil.');
    }

    public function approvePayment(Request $request, $id)
    {
        $order = Order::with('payment')->find($id);

        if (!$order) {
            return ApiResponse::error('Order tidak ditemukan.', 404);
        }

        if (!$order->payment) {
            return ApiResponse::error('Data pembayaran tidak ditemukan.', 404);
        }

        if ($order->status_pesanan === 'ditolak') {
            return ApiResponse::error('Order sudah ditolak, pembayaran tidak bisa disetujui.', 422);
        }

        if ($order->status_pesanan === 'selesai') {
            return ApiResponse::error('Order sudah selesai, pembayaran tidak bisa diubah.', 422);
        }

        if ($order->status_pembayaran === 'lunas') {
            return ApiResponse::error('Pembayaran sudah lunas.', 422);
        }

        if ($order->status_pembayaran !== 'menunggu_verifikasi') {
            return ApiResponse::error('Pembayaran hanya bisa disetujui jika status masih menunggu verifikasi.', 422);
        }

        if ($order->payment->status !== 'menunggu_verifikasi') {
            return ApiResponse::error('Data pembayaran tidak berada pada status menunggu verifikasi.', 422);
        }

        try {
            DB::beginTransaction();

            $order->payment->update([
                'status' => 'lunas',
                'diverifikasi_oleh' => $request->user()->id,
                'diverifikasi_pada' => now(),
                'alasan_penolakan' => null,
            ]);

            $order->update([
                'status_pembayaran' => 'lunas',
                'catatan_admin' => null,
            ]);

            AdminNote::create([
                'order_id' => $order->id,
                'admin_id' => $request->user()->id,
                'catatan' => 'Pembayaran telah diverifikasi dan dinyatakan lunas.',
            ]);

            DB::commit();

            $order->load([
                'user',
                'template',
                'payment.verifier',
                'adminNotes.admin',
            ]);

            return ApiResponse::success($order, 'Pembayaran berhasil disetujui. Status pembayaran menjadi lunas.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return ApiResponse::error('Gagal menyetujui pembayaran.', 500, [
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function rejectPayment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'alasan_penolakan' => ['required', 'string', 'min:5'],
        ], [
            'alasan_penolakan.required' => 'Alasan penolakan wajib diisi.',
            'alasan_penolakan.min' => 'Alasan penolakan minimal 5 karakter.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal.', 422, $validator->errors());
        }

        $order = Order::with('payment')->find($id);

        if (!$order) {
            return ApiResponse::error('Order tidak ditemukan.', 404);
        }

        if (!$order->payment) {
            return ApiResponse::error('Data pembayaran tidak ditemukan.', 404);
        }

        if ($order->status_pesanan === 'selesai') {
            return ApiResponse::error('Order sudah selesai, pembayaran tidak bisa diubah.', 422);
        }

        if ($order->status_pembayaran === 'lunas') {
            return ApiResponse::error('Pembayaran sudah lunas, tidak bisa ditolak.', 422);
        }

        if ($order->status_pembayaran !== 'menunggu_verifikasi') {
            return ApiResponse::error('Pembayaran hanya bisa ditolak jika status masih menunggu verifikasi.', 422);
        }

        try {
            DB::beginTransaction();

            $order->payment->update([
                'status' => 'ditolak',
                'diverifikasi_oleh' => $request->user()->id,
                'diverifikasi_pada' => now(),
                'alasan_penolakan' => $request->alasan_penolakan,
            ]);

            $order->update([
                'status_pembayaran' => 'ditolak',
                'catatan_admin' => $request->alasan_penolakan,
            ]);

            AdminNote::create([
                'order_id' => $order->id,
                'admin_id' => $request->user()->id,
                'catatan' => $request->alasan_penolakan,
            ]);

            DB::commit();

            $order->load([
                'user',
                'template',
                'payment.verifier',
                'adminNotes.admin',
            ]);

            return ApiResponse::success($order, 'Pembayaran berhasil ditolak. User dapat upload ulang bukti pembayaran.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return ApiResponse::error('Gagal menolak pembayaran.', 500, [
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function processOrder(Request $request, $id)
    {
        $order = Order::with(['payment', 'user', 'template'])->find($id);

        if (!$order) {
            return ApiResponse::error('Order tidak ditemukan.', 404);
        }

        if ($order->status_pesanan === 'selesai') {
            return ApiResponse::error('Order sudah selesai dan tidak bisa diproses ulang.', 422);
        }

        if ($order->status_pesanan === 'ditolak') {
            return ApiResponse::error('Order sudah ditolak dan tidak bisa diproses.', 422);
        }

        if ($order->status_pembayaran !== 'lunas') {
            return ApiResponse::error('Order hanya bisa diproses jika pembayaran sudah lunas.', 422);
        }

        if (!$order->payment || $order->payment->status !== 'lunas') {
            return ApiResponse::error('Data pembayaran belum lunas.', 422);
        }

        if ($order->status_pesanan === 'diproses') {
            return ApiResponse::error('Order sudah dalam status diproses.', 422);
        }

        try {
            DB::beginTransaction();

            $order->update([
                'status_pesanan' => 'diproses',
                'catatan_admin' => null,
            ]);

            AdminNote::create([
                'order_id' => $order->id,
                'admin_id' => $request->user()->id,
                'catatan' => 'Order mulai diproses oleh admin.',
            ]);

            DB::commit();

            $order->load([
                'user',
                'template',
                'payment',
                'adminNotes.admin',
            ]);

            return ApiResponse::success($order, 'Order berhasil diubah menjadi diproses.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return ApiResponse::error('Gagal memproses order.', 500, [
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function rejectOrder(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'alasan_penolakan' => ['required', 'string', 'min:5'],
        ], [
            'alasan_penolakan.required' => 'Alasan penolakan order wajib diisi.',
            'alasan_penolakan.min' => 'Alasan penolakan order minimal 5 karakter.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal.', 422, $validator->errors());
        }

        $order = Order::with(['payment', 'user', 'template'])->find($id);

        if (!$order) {
            return ApiResponse::error('Order tidak ditemukan.', 404);
        }

        if ($order->status_pesanan === 'selesai') {
            return ApiResponse::error('Order sudah selesai dan tidak bisa ditolak.', 422);
        }

        if ($order->status_pesanan === 'ditolak') {
            return ApiResponse::error('Order sudah ditolak.', 422);
        }

        if ($order->status_pesanan === 'diproses') {
            return ApiResponse::error('Order sedang diproses dan tidak bisa ditolak dari endpoint ini.', 422);
        }

        try {
            DB::beginTransaction();

            if ($order->payment) {
                $order->payment->update([
                    'status' => 'ditolak',
                    'diverifikasi_oleh' => $request->user()->id,
                    'diverifikasi_pada' => now(),
                    'alasan_penolakan' => $request->alasan_penolakan,
                ]);
            }

            $order->update([
                'status_pesanan' => 'ditolak',
                'status_pembayaran' => 'ditolak',
                'catatan_admin' => $request->alasan_penolakan,
            ]);

            AdminNote::create([
                'order_id' => $order->id,
                'admin_id' => $request->user()->id,
                'catatan' => $request->alasan_penolakan,
            ]);

            DB::commit();

            $order->load([
                'user',
                'template',
                'payment',
                'adminNotes.admin',
            ]);

            return ApiResponse::success($order, 'Order berhasil ditolak. Status pembayaran juga otomatis ditolak.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return ApiResponse::error('Gagal menolak order.', 500, [
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function updatePortfolioData(Request $request, $id)
    {
        $order = Order::with([
            'portfolioProfile',
            'skills',
            'tools',
            'projects',
            'educations',
            'experiences',
            'certificates',
            'achievements',
            'payment',
        ])->find($id);

        if (!$order) {
            return ApiResponse::error('Order tidak ditemukan.', 404);
        }

        if ($order->status_pembayaran !== 'lunas') {
            return ApiResponse::error('Data portfolio hanya bisa diedit jika pembayaran sudah lunas.', 422);
        }

        if ($order->status_pesanan !== 'diproses') {
            return ApiResponse::error('Data portfolio hanya bisa diedit saat order berstatus diproses.', 422);
        }

        if (!$order->portfolioProfile) {
            return ApiResponse::error('Data profil portfolio tidak ditemukan.', 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'profesi' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'nomor_hp' => ['required', 'string', 'max:20'],

            'instagram' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'github' => ['nullable', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],

            'about_me' => ['nullable', 'string'],

            'skills' => ['nullable', 'array'],
            'skills.*.nama_skill' => ['required_with:skills', 'string', 'max:255'],
            'skills.*.level_skill' => ['nullable', 'string', 'max:255'],

            'tools' => ['nullable', 'array'],
            'tools.*.nama_tools' => ['required_with:tools', 'string', 'max:255'],

            'projects' => ['nullable', 'array'],
            'projects.*.nama_project' => ['required_with:projects', 'string', 'max:255'],
            'projects.*.deskripsi_project' => ['required_with:projects', 'string'],
            'projects.*.link_project' => ['nullable', 'string', 'max:255'],

            'educations' => ['nullable', 'array'],
            'educations.*.nama_sekolah' => ['required_with:educations', 'string', 'max:255'],
            'educations.*.jurusan' => ['nullable', 'string', 'max:255'],
            'educations.*.tahun_mulai' => ['nullable', 'string', 'max:255'],
            'educations.*.tahun_selesai' => ['nullable', 'string', 'max:255'],
            'educations.*.deskripsi' => ['nullable', 'string'],

            'experiences' => ['nullable', 'array'],
            'experiences.*.nama_tempat' => ['required_with:experiences', 'string', 'max:255'],
            'experiences.*.posisi' => ['required_with:experiences', 'string', 'max:255'],
            'experiences.*.deskripsi' => ['nullable', 'string'],
            'experiences.*.tahun_mulai' => ['nullable', 'string', 'max:255'],
            'experiences.*.tahun_selesai' => ['nullable', 'string', 'max:255'],

            'certificates' => ['nullable', 'array'],
            'certificates.*.nama_sertifikat' => ['required_with:certificates', 'string', 'max:255'],
            'certificates.*.penerbit' => ['nullable', 'string', 'max:255'],
            'certificates.*.tahun' => ['nullable', 'string', 'max:255'],

            'achievements' => ['nullable', 'array'],
            'achievements.*.nama_pencapaian' => ['required_with:achievements', 'string', 'max:255'],
            'achievements.*.deskripsi' => ['nullable', 'string'],
            'achievements.*.tahun' => ['nullable', 'string', 'max:255'],
        ], [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nama_lengkap.min' => 'Nama lengkap minimal 3 karakter.',
            'profesi.required' => 'Profesi wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'nomor_hp.required' => 'Nomor HP wajib diisi.',
        ]);

        if ($validator->fails()) {
            return ApiResponse::error('Validasi gagal.', 422, $validator->errors());
        }

        $paket = strtolower(trim($order->paket));
        if ($paket === 'standar') $paket = 'standard';

        $packageValidation = $this->validateEditablePortfolioByPackage($request, $paket);

        if ($packageValidation !== true) {
            return $packageValidation;
        }

        try {
            DB::beginTransaction();

            $order->portfolioProfile->update([
                'nama_lengkap' => $request->nama_lengkap,
                'profesi' => $request->profesi,
                'email' => $request->email,
                'nomor_hp' => $request->nomor_hp,
                'instagram' => $request->instagram,
                'linkedin' => $request->linkedin,
                'github' => $request->github,
                'website' => $request->website,
                'foto_profil' => $request->foto_profil ?? $order->portfolioProfile->foto_profil,
                'about_me' => in_array($paket, ['standard', 'premium'])
                    ? $request->about_me
                    : $order->portfolioProfile->about_me,
            ]);

            if (in_array($paket, ['standard', 'premium'])) {
                PortfolioSkill::where('order_id', $order->id)->delete();

                foreach ($request->skills ?? [] as $skill) {
                    PortfolioSkill::create([
                        'order_id' => $order->id,
                        'nama_skill' => $skill['nama_skill'],
                        'level_skill' => $skill['level_skill'] ?? null,
                    ]);
                }

                PortfolioTool::where('order_id', $order->id)->delete();

                foreach ($request->tools ?? [] as $tool) {
                    PortfolioTool::create([
                        'order_id' => $order->id,
                        'nama_tools' => $tool['nama_tools'],
                    ]);
                }
            }

            if ($paket === 'premium') {
               $oldProjects = $order->projects;
               
                PortfolioProject::where('order_id', $order->id)->delete();

                foreach ($request->projects ?? [] as $project) {
                    $oldProject = null;
                    if (isset($project['id'])) {
                        $oldProject = $oldProjects->firstWhere('id', $project['id']);
                    }

                    PortfolioProject::create([
                        'order_id' => $order->id,
                        'nama_project' => $project['nama_project'],
                        'deskripsi_project' => $project['deskripsi_project'],
                        'link_project' => $project['link_project'] ?? null,
                        'gambar_project' =>
                            (!empty($project['gambar_project']) ? $project['gambar_project'] : null) ??
                            (!empty($project['image']) ? $project['image'] : null) ??
                            (!empty($project['gambar']) ? $project['gambar'] : null) ??
                            $oldProject?->gambar_project,
                    ]);
                }

                PortfolioEducation::where('order_id', $order->id)->delete();

                foreach ($request->educations ?? [] as $education) {
                    PortfolioEducation::create([
                        'order_id' => $order->id,
                        'nama_sekolah' => $education['nama_sekolah'],
                        'jurusan' => $education['jurusan'] ?? null,
                        'tahun_mulai' => $education['tahun_mulai'] ?? null,
                        'tahun_selesai' => $education['tahun_selesai'] ?? null,
                        'deskripsi' => $education['deskripsi'] ?? null,
                    ]);
                }

                PortfolioExperience::where('order_id', $order->id)->delete();

                foreach ($request->experiences ?? [] as $experience) {
                    PortfolioExperience::create([
                        'order_id' => $order->id,
                        'nama_tempat' => $experience['nama_tempat'],
                        'posisi' => $experience['posisi'],
                        'deskripsi' => $experience['deskripsi'] ?? null,
                        'tahun_mulai' => $experience['tahun_mulai'] ?? null,
                        'tahun_selesai' => $experience['tahun_selesai'] ?? null,
                    ]);
                }

              $oldCertificates = $order->certificates;

                PortfolioCertificate::where('order_id', $order->id)->delete();

                foreach ($request->certificates ?? [] as $certificate) {
                    $oldCertificate = null;
                    if (isset($certificate['id'])) {
                        $oldCertificate = $oldCertificates->firstWhere('id', $certificate['id']);
                    }

                    PortfolioCertificate::create([
                        'order_id' => $order->id,
                        'nama_sertifikat' => $certificate['nama_sertifikat'],
                        'penerbit' => $certificate['penerbit'] ?? null,
                        'tahun' => $certificate['tahun'] ?? null,
                        'file_sertifikat' =>
                            (!empty($certificate['file_sertifikat']) ? $certificate['file_sertifikat'] : null) ??
                            (!empty($certificate['file']) ? $certificate['file'] : null) ??
                            (!empty($certificate['certificate_file']) ? $certificate['certificate_file'] : null) ??
                            $oldCertificate?->file_sertifikat,
                    ]);
                }

                PortfolioAchievement::where('order_id', $order->id)->delete();

                foreach ($request->achievements ?? [] as $achievement) {
                    PortfolioAchievement::create([
                        'order_id' => $order->id,
                        'nama_pencapaian' => $achievement['nama_pencapaian'],
                        'deskripsi' => $achievement['deskripsi'] ?? null,
                        'tahun' => $achievement['tahun'] ?? null,
                    ]);
                }
            }

            AdminNote::create([
                'order_id' => $order->id,
                'admin_id' => $request->user()->id,
                'catatan' => 'Data portfolio dirapikan oleh admin sesuai paket ' . $paket . '.',
            ]);

            DB::commit();

            $order->load([
                'user',
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
            ]);

            return ApiResponse::success($order, 'Data portfolio berhasil diperbarui sesuai paket.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return ApiResponse::error('Gagal memperbarui data portfolio.', 500, [
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function previewPortfolio($id)
    {
        $order = Order::with([
            'user',
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
        ])->find($id);

        if (!$order) {
            return ApiResponse::error('Order tidak ditemukan.', 404);
        }

        if ($order->status_pembayaran !== 'lunas') {
            return ApiResponse::error('Preview portfolio hanya bisa dilihat jika pembayaran sudah lunas.', 422);
        }

        if (!in_array($order->status_pesanan, ['diproses', 'selesai'])) {
            return ApiResponse::error('Preview portfolio hanya bisa dilihat saat order diproses atau selesai.', 422);
        }

        if (!$order->portfolioProfile) {
            return ApiResponse::error('Data profil portfolio tidak ditemukan.', 404);
        }

        $dummyData = $this->getDummyTemplateData($order->template->nama_template);
        $profile = $order->portfolioProfile;

        $preview = [
            'order' => [
                'id' => $order->id,
                'kode_order' => $order->kode_order,
                'paket' => $order->paket,
                'status_pesanan' => $order->status_pesanan,
                'status_pembayaran' => $order->status_pembayaran,
            ],

            'template' => [
                'id' => $order->template->id,
                'nama_template' => $order->template->nama_template,
                'kategori' => $order->template->kategori,
                'deskripsi' => $order->template->deskripsi,
                'preview_gambar' => $order->template->preview_gambar,
                'demo_link' => $order->template->demo_link,
            ],

            'aturan_preview' => [
                'paket_order_ini' => $order->paket,
                'basic' => 'Data utama user tampil. About, skills, tools, project, education, experience, certificates, achievements tetap menggunakan data dummy template.',
                'standard' => 'Data utama, about me, skills, dan tools tampil dari user. Project, education, experience, certificates, achievements tetap menggunakan data dummy template.',
                'premium' => 'Hampir semua data portfolio tampil dari user. Desain template tetap tidak berubah.',
            ],

            'hero' => [
                'nama_lengkap' => $profile->nama_lengkap,
                'profesi' => $profile->profesi,
                'foto_profil' => $profile->foto_profil,
                'headline' => $dummyData['hero']['headline'],
                'deskripsi_singkat' => $this->getPreviewAboutMe($order, $dummyData),
                'sumber_data' => [
                    'nama_lengkap' => 'user',
                    'profesi' => 'user',
                    'foto_profil' => 'user',
                    'headline' => 'dummy_template',
                    'deskripsi_singkat' => in_array($order->paket, ['standard', 'premium']) ? 'user' : 'dummy_template',
                ],
            ],

            'biodata' => [
                'nama_lengkap' => $profile->nama_lengkap,
                'profesi' => $profile->profesi,
                'email' => $profile->email,
                'nomor_hp' => $profile->nomor_hp,
                'instagram' => $profile->instagram,
                'linkedin' => $profile->linkedin,
                'github' => $profile->github,
                'website' => $profile->website,
                'sumber_data' => 'user',
            ],

            'about_me' => [
                'data' => $this->getPreviewAboutMe($order, $dummyData),
                'sumber_data' => in_array($order->paket, ['standard', 'premium']) ? 'user' : 'dummy_template',
            ],

            'skills' => [
                'data' => $this->getPreviewSkills($order, $dummyData),
                'sumber_data' => in_array($order->paket, ['standard', 'premium']) ? 'user' : 'dummy_template',
            ],

            'tools' => [
                'data' => $this->getPreviewTools($order, $dummyData),
                'sumber_data' => in_array($order->paket, ['standard', 'premium']) ? 'user' : 'dummy_template',
            ],

            'projects' => [
                'data' => $this->getPreviewProjects($order, $dummyData),
                'sumber_data' => $order->paket === 'premium' ? 'user' : 'dummy_template',
            ],

            'educations' => [
                'data' => $this->getPreviewEducations($order, $dummyData),
                'sumber_data' => $order->paket === 'premium' ? 'user' : 'dummy_template',
            ],

            'experiences' => [
                'data' => $this->getPreviewExperiences($order, $dummyData),
                'sumber_data' => $order->paket === 'premium' ? 'user' : 'dummy_template',
            ],

            'certificates' => [
                'data' => $this->getPreviewCertificates($order, $dummyData),
                'sumber_data' => $order->paket === 'premium' ? 'user' : 'dummy_template',
            ],

            'achievements' => [
                'data' => $this->getPreviewAchievements($order, $dummyData),
                'sumber_data' => $order->paket === 'premium' ? 'user' : 'dummy_template',
            ],

            'contact' => [
                'email' => $profile->email,
                'nomor_hp' => $profile->nomor_hp,
                'instagram' => $profile->instagram,
                'linkedin' => $profile->linkedin,
                'github' => $profile->github,
                'website' => $profile->website,
                'sumber_data' => 'user',
            ],

            'portfolio_link' => $order->portfolioLink,
        ];

        return ApiResponse::success($preview, 'Preview portfolio berhasil diambil.');
    }

    public function activatePortfolioLink(Request $request, $id)
    {
        $order = Order::with([
            'user',
            'template',
            'portfolioProfile',
            'payment',
            'portfolioLink',
        ])->find($id);

        if (!$order) {
            return ApiResponse::error('Order tidak ditemukan.', 404);
        }

        if ($order->status_pembayaran !== 'lunas') {
            return ApiResponse::error('Link portfolio hanya bisa diaktifkan jika pembayaran sudah lunas.', 422);
        }

        if ($order->status_pesanan !== 'diproses') {
            return ApiResponse::error('Link portfolio hanya bisa diaktifkan saat order berstatus diproses.', 422);
        }

        if (!$order->payment || $order->payment->status !== 'lunas') {
            return ApiResponse::error('Data pembayaran belum lunas.', 422);
        }

        if (!$order->portfolioProfile) {
            return ApiResponse::error('Data profil portfolio tidak ditemukan.', 404);
        }

        if ($order->portfolioLink && $order->portfolioLink->is_active) {
            return ApiResponse::error('Link portfolio sudah aktif.', 422);
        }

        try {
            DB::beginTransaction();

            $slug = $this->generatePortfolioSlug(
                $order->portfolioProfile->nama_lengkap,
                $order->kode_order
            );

            $urlFinal = ('/portfolio/' . $slug);

            $portfolioLink = PortfolioLink::updateOrCreate(
                [
                    'order_id' => $order->id,
                ],
                [
                    'slug' => $slug,
                    'url_final' => $urlFinal,
                    'is_active' => true,
                    'diaktifkan_oleh' => $request->user()->id,
                    'diaktifkan_pada' => now(),
                ]
            );

            $order->update([
                'status_pesanan' => 'selesai',
                'catatan_admin' => null,
            ]);

            AdminNote::create([
                'order_id' => $order->id,
                'admin_id' => $request->user()->id,
                'catatan' => 'Link portfolio final berhasil diaktifkan dan order ditandai selesai.',
            ]);

            DB::commit();

            $order->load([
                'user',
                'template',
                'portfolioProfile',
                'payment',
                'portfolioLink',
                'adminNotes.admin',
            ]);

            return ApiResponse::success([
                'order' => $order,
                'portfolio_link' => $portfolioLink,
            ], 'Link portfolio final berhasil diaktifkan. Order selesai.');
        } catch (\Throwable $e) {
            DB::rollBack();

            return ApiResponse::error('Gagal mengaktifkan link portfolio.', 500, [
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function validateEditablePortfolioByPackage(Request $request, string $paket)
    {
        $paket = strtolower(trim($paket));
        if ($paket === 'standar') $paket = 'standard';

        if ($paket === 'basic') {
            if (
                $request->filled('about_me') ||
                $request->filled('skills') ||
                $request->filled('tools') ||
                $request->filled('projects') ||
                $request->filled('educations') ||
                $request->filled('experiences') ||
                $request->filled('certificates') ||
                $request->filled('achievements')
            ) {
                return ApiResponse::error('Paket Basic hanya boleh mengedit data utama, kontak, dan sosial media dasar.', 422);
            }

            return true;
        }

        if ($paket === 'standard') {
            /*
            if (!$request->filled('about_me')) {
                return ApiResponse::error('About Me wajib diisi untuk paket Standard.', 422);
            }
            */

            // Relaxed validation for skills and tools (admin can clear them)
            // But we keep it if the intention is to require at least one
            if (!is_array($request->skills) || count($request->skills) < 1) {
                return ApiResponse::error('Skills minimal 1 untuk paket Standard.', 422);
            }

            if (!is_array($request->tools) || count($request->tools) < 1) {
                return ApiResponse::error('Tools minimal 1 untuk paket Standard.', 422);
            }

            if (
                $request->filled('projects') ||
                $request->filled('educations') ||
                $request->filled('experiences') ||
                $request->filled('certificates') ||
                $request->filled('achievements')
            ) {
                return ApiResponse::error('Paket Standard tidak boleh mengedit project, education, experience, certificate, dan achievement.', 422);
            }

            return true;
        }

        if ($paket === 'premium') {
            /*
            if (!$request->filled('about_me')) {
                return ApiResponse::error('About Me wajib diisi untuk paket Premium.', 422);
            }
            */

            if (!is_array($request->skills) || count($request->skills) < 1) {
                return ApiResponse::error('Skills minimal 1 untuk paket Premium.', 422);
            }

            if (!is_array($request->tools) || count($request->tools) < 1) {
                return ApiResponse::error('Tools minimal 1 untuk paket Premium.', 422);
            }

            // Allow empty projects/educations for premium during edit so admin can save partial data
            /*
            if (!is_array($request->projects) || count($request->projects) < 1) {
                return ApiResponse::error('Project minimal 1 untuk paket Premium.', 422);
            }

            if (!is_array($request->educations) || count($request->educations) < 1) {
                return ApiResponse::error('Education minimal 1 untuk paket Premium.', 422);
            }
            */

            return true;
        }

        return ApiResponse::error('Paket ' . $paket . ' tidak valid.', 422);
    }

    private function getDummyTemplateData(string $templateName): array
    {
        if ($templateName === 'Developer Spark Portfolio') {
            return [
                'hero' => [
                    'headline' => 'Building modern and responsive web experiences.',
                ],
                'about_me' => 'Saya adalah frontend developer yang fokus membuat website modern, responsif, dan mudah digunakan. Saya tertarik pada pengembangan antarmuka, performa website, dan pengalaman pengguna.',
                'skills' => [
                    ['nama_skill' => 'HTML', 'level_skill' => 'Mahir'],
                    ['nama_skill' => 'CSS', 'level_skill' => 'Mahir'],
                    ['nama_skill' => 'JavaScript', 'level_skill' => 'Menengah'],
                    ['nama_skill' => 'React', 'level_skill' => 'Menengah'],
                    ['nama_skill' => 'Laravel', 'level_skill' => 'Menengah'],
                    ['nama_skill' => 'Responsive Design', 'level_skill' => 'Mahir'],
                ],
                'tools' => [
                    ['nama_tools' => 'VS Code'],
                    ['nama_tools' => 'GitHub'],
                    ['nama_tools' => 'Figma'],
                    ['nama_tools' => 'Postman'],
                    ['nama_tools' => 'pgAdmin'],
                ],
                'projects' => [
                    [
                        'nama_project' => 'Portfolio Website',
                        'deskripsi_project' => 'Website portfolio personal untuk menampilkan profil, skill, dan project.',
                        'link_project' => 'https://example.com/portfolio-website',
                        'gambar_project' => 'dummy/developer/project-1.png',
                    ],
                    [
                        'nama_project' => 'Admin Dashboard UI',
                        'deskripsi_project' => 'Dashboard untuk mengelola data user, template, dan pesanan.',
                        'link_project' => 'https://example.com/admin-dashboard',
                        'gambar_project' => 'dummy/developer/project-2.png',
                    ],
                    [
                        'nama_project' => 'Landing Page Product',
                        'deskripsi_project' => 'Website promosi produk digital dengan tampilan modern.',
                        'link_project' => 'https://example.com/landing-page',
                        'gambar_project' => 'dummy/developer/project-3.png',
                    ],
                ],
                'educations' => [
                    [
                        'nama_sekolah' => 'Universitas Digital Indonesia',
                        'jurusan' => 'Sistem Informasi',
                        'tahun_mulai' => '2020',
                        'tahun_selesai' => '2024',
                        'deskripsi' => 'Fokus pada pengembangan sistem informasi dan aplikasi web.',
                    ],
                ],
                'experiences' => [
                    [
                        'nama_tempat' => 'PT Digital Kreatif',
                        'posisi' => 'Frontend Developer Intern',
                        'tahun_mulai' => '2023',
                        'tahun_selesai' => '2024',
                        'deskripsi' => 'Membantu membuat tampilan website, slicing UI, dan integrasi tampilan dengan API.',
                    ],
                ],
                'certificates' => [
                    [
                        'nama_sertifikat' => 'Web Development Basic',
                        'penerbit' => 'Build Academy',
                        'tahun' => '2024',
                        'file_sertifikat' => 'dummy/developer/certificate-1.png',
                    ],
                    [
                        'nama_sertifikat' => 'React for Beginner',
                        'penerbit' => 'Digital Course',
                        'tahun' => '2025',
                        'file_sertifikat' => 'dummy/developer/certificate-2.png',
                    ],
                ],
                'achievements' => [
                    [
                        'nama_pencapaian' => 'Best Web Project',
                        'deskripsi' => 'Membuat website portfolio interaktif sebagai project terbaik.',
                        'tahun' => '2024',
                    ],
                ],
            ];
        }

        if ($templateName === 'Creative Editorial Portfolio') {
            return [
                'hero' => [
                    'headline' => 'Designing clean, meaningful, and user-friendly digital experiences.',
                ],
                'about_me' => 'Saya adalah UI/UX Designer yang fokus pada desain antarmuka, pengalaman pengguna, dan visual branding. Saya senang membuat desain yang bersih, fungsional, dan memiliki karakter visual yang kuat.',
                'skills' => [
                    ['nama_skill' => 'UI Design', 'level_skill' => 'Mahir'],
                    ['nama_skill' => 'UX Research', 'level_skill' => 'Menengah'],
                    ['nama_skill' => 'Wireframing', 'level_skill' => 'Mahir'],
                    ['nama_skill' => 'Prototyping', 'level_skill' => 'Mahir'],
                    ['nama_skill' => 'Branding', 'level_skill' => 'Menengah'],
                ],
                'tools' => [
                    ['nama_tools' => 'Figma'],
                    ['nama_tools' => 'Adobe XD'],
                    ['nama_tools' => 'Photoshop'],
                    ['nama_tools' => 'Illustrator'],
                    ['nama_tools' => 'Canva'],
                ],
                'projects' => [
                    [
                        'nama_project' => 'Mobile Banking App Redesign',
                        'deskripsi_project' => 'Redesign aplikasi mobile banking dengan fokus pada kemudahan navigasi.',
                        'link_project' => 'https://example.com/mobile-banking-redesign',
                        'gambar_project' => 'dummy/creative/project-1.png',
                    ],
                    [
                        'nama_project' => 'Fashion E-Commerce UI',
                        'deskripsi_project' => 'Desain e-commerce fashion dengan layout editorial dan visual produk yang kuat.',
                        'link_project' => 'https://example.com/fashion-ecommerce',
                        'gambar_project' => 'dummy/creative/project-2.png',
                    ],
                    [
                        'nama_project' => 'Food Delivery App',
                        'deskripsi_project' => 'Desain aplikasi pemesanan makanan dengan user flow sederhana.',
                        'link_project' => 'https://example.com/food-delivery',
                        'gambar_project' => 'dummy/creative/project-3.png',
                    ],
                ],
                'educations' => [
                    [
                        'nama_sekolah' => 'Institut Kreatif Indonesia',
                        'jurusan' => 'Desain Komunikasi Visual',
                        'tahun_mulai' => '2020',
                        'tahun_selesai' => '2024',
                        'deskripsi' => 'Fokus pada desain visual, branding, dan komunikasi kreatif.',
                    ],
                ],
                'experiences' => [
                    [
                        'nama_tempat' => 'Creative Studio Lab',
                        'posisi' => 'UI/UX Designer Intern',
                        'tahun_mulai' => '2023',
                        'tahun_selesai' => '2024',
                        'deskripsi' => 'Membantu membuat wireframe, prototype, dan visual design untuk project digital.',
                    ],
                ],
                'certificates' => [
                    [
                        'nama_sertifikat' => 'UI Design Fundamental',
                        'penerbit' => 'Creative Academy',
                        'tahun' => '2024',
                        'file_sertifikat' => 'dummy/creative/certificate-1.png',
                    ],
                ],
                'achievements' => [
                    [
                        'nama_pencapaian' => 'Selected Design Showcase',
                        'deskripsi' => 'Karya desain terpilih dalam showcase internal kampus.',
                        'tahun' => '2024',
                    ],
                ],
            ];
        }

        return [
            'hero' => [
                'headline' => 'Turning ideas into meaningful digital solutions.',
            ],
            'about_me' => 'Saya adalah individu yang tertarik pada pengembangan bisnis, analisis kebutuhan, dan pengelolaan project. Saya memiliki kemampuan komunikasi, perencanaan, dan pemecahan masalah yang baik.',
            'skills' => [
                ['nama_skill' => 'Business Analysis', 'level_skill' => 'Menengah'],
                ['nama_skill' => 'Communication', 'level_skill' => 'Mahir'],
                ['nama_skill' => 'Problem Solving', 'level_skill' => 'Mahir'],
                ['nama_skill' => 'Project Planning', 'level_skill' => 'Menengah'],
                ['nama_skill' => 'Public Speaking', 'level_skill' => 'Menengah'],
            ],
            'tools' => [
                ['nama_tools' => 'Notion'],
                ['nama_tools' => 'Google Workspace'],
                ['nama_tools' => 'Microsoft Excel'],
                ['nama_tools' => 'Canva'],
                ['nama_tools' => 'Trello'],
            ],
            'projects' => [
                [
                    'nama_project' => 'Market Research Dashboard',
                    'deskripsi_project' => 'Project analisis pasar untuk memahami kebutuhan pengguna dan peluang bisnis.',
                    'link_project' => 'https://example.com/market-research',
                    'gambar_project' => 'dummy/minimal/project-1.png',
                ],
                [
                    'nama_project' => 'Startup Validation Project',
                    'deskripsi_project' => 'Validasi ide startup melalui riset, survei, dan penyusunan strategi awal.',
                    'link_project' => 'https://example.com/startup-validation',
                    'gambar_project' => 'dummy/minimal/project-2.png',
                ],
                [
                    'nama_project' => 'Business Pitch Deck',
                    'deskripsi_project' => 'Penyusunan pitch deck bisnis untuk presentasi ide produk digital.',
                    'link_project' => 'https://example.com/pitch-deck',
                    'gambar_project' => 'dummy/minimal/project-3.png',
                ],
            ],
            'educations' => [
                [
                    'nama_sekolah' => 'Universitas Teknologi Nusantara',
                    'jurusan' => 'Sistem Informasi',
                    'tahun_mulai' => '2020',
                    'tahun_selesai' => '2024',
                    'deskripsi' => 'Fokus pada pengembangan sistem informasi, bisnis digital, dan analisis kebutuhan.',
                ],
            ],
            'experiences' => [
                [
                    'nama_tempat' => 'PT Inovasi Digital',
                    'posisi' => 'Business Development Intern',
                    'tahun_mulai' => '2023',
                    'tahun_selesai' => '2024',
                    'deskripsi' => 'Membantu riset pasar, menyusun laporan, dan mendukung proses pengembangan ide bisnis.',
                ],
            ],
            'certificates' => [
                [
                    'nama_sertifikat' => 'Business Analysis Fundamental',
                    'penerbit' => 'Professional Course',
                    'tahun' => '2024',
                    'file_sertifikat' => 'dummy/minimal/certificate-1.png',
                ],
            ],
            'achievements' => [
                [
                    'nama_pencapaian' => 'Best Business Pitch',
                    'deskripsi' => 'Membuat presentasi ide bisnis terbaik dalam project kelas.',
                    'tahun' => '2024',
                ],
            ],
        ];
    }

    private function getPreviewAboutMe(Order $order, array $dummyData)
    {
        if (in_array($order->paket, ['standard', 'premium']) && $order->portfolioProfile->about_me) {
            return $order->portfolioProfile->about_me;
        }

        return $dummyData['about_me'];
    }

    private function getPreviewSkills(Order $order, array $dummyData)
    {
        if (in_array($order->paket, ['standard', 'premium']) && $order->skills->count() > 0) {
            return $order->skills;
        }

        return $dummyData['skills'];
    }

    private function getPreviewTools(Order $order, array $dummyData)
    {
        if (in_array($order->paket, ['standard', 'premium']) && $order->tools->count() > 0) {
            return $order->tools;
        }

        return $dummyData['tools'];
    }

    private function getPreviewProjects(Order $order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->projects->count() > 0) {
            return $order->projects;
        }

        return $dummyData['projects'];
    }

    private function getPreviewEducations(Order $order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->educations->count() > 0) {
            return $order->educations;
        }

        return $dummyData['educations'];
    }

    private function getPreviewExperiences(Order $order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->experiences->count() > 0) {
            return $order->experiences;
        }

        return $dummyData['experiences'];
    }

    private function getPreviewCertificates(Order $order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->certificates->count() > 0) {
            return $order->certificates;
        }

        return $dummyData['certificates'];
    }

    private function getPreviewAchievements(Order $order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->achievements->count() > 0) {
            return $order->achievements;
        }

        return $dummyData['achievements'];
    }

    private function generatePortfolioSlug(string $namaLengkap, string $kodeOrder): string
    {
        $baseSlug = Str::slug($namaLengkap);
        $cleanOrderCode = Str::lower(str_replace('-', '', $kodeOrder));

        $slug = $baseSlug . '-' . $cleanOrderCode;
        $originalSlug = $slug;
        $counter = 1;

        while (PortfolioLink::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}