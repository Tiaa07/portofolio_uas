<?php

namespace App\Http\Controllers\Api\Public;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\PortfolioLink;

class PortfolioController extends Controller
{
    public function show($slug)
    {
        $portfolioLink = PortfolioLink::with([
                'order.user',
                'order.template',
                'order.portfolioProfile',
                'order.skills',
                'order.tools',
                'order.projects',
                'order.educations',
                'order.experiences',
                'order.certificates',
                'order.achievements',
            ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$portfolioLink) {
            return ApiResponse::error('Portfolio tidak ditemukan atau belum aktif.', 404);
        }

        $order = $portfolioLink->order;

        if (!$order) {
            return ApiResponse::error('Data order portfolio tidak ditemukan.', 404);
        }

        if ($order->status_pesanan !== 'selesai' || $order->status_pembayaran !== 'lunas') {
            return ApiResponse::error('Portfolio belum tersedia untuk publik.', 404);
        }

        if (!$order->portfolioProfile) {
            return ApiResponse::error('Data portfolio belum lengkap.', 404);
        }

        $dummyData = $this->getDummyTemplateData($order->template->nama_template);
        $profile = $order->portfolioProfile;

        $portfolio = [
            'meta' => [
                'title' => $profile->nama_lengkap . ' - ' . $profile->profesi,
                'description' => $this->getPreviewAboutMe($order, $dummyData),
                'slug' => $portfolioLink->slug,
                'url_final' => $portfolioLink->url_final,
                'is_active' => $portfolioLink->is_active,
            ],

            'template' => [
                'id' => $order->template->id,
                'nama_template' => $order->template->nama_template,
                'kategori' => $order->template->kategori,
                'deskripsi' => $order->template->deskripsi,
                'preview_gambar' => $order->template->preview_gambar,
                'demo_link' => $order->template->demo_link,
            ],

            'order_info' => [
                'paket' => $order->paket,
            ],

            'hero' => [
                'nama_lengkap' => $profile->nama_lengkap,
                'profesi' => $profile->profesi,
                'foto_profil' => $profile->foto_profil,
                'headline' => $dummyData['hero']['headline'],
                'deskripsi_singkat' => $this->getPreviewAboutMe($order, $dummyData),
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
            ],

            'about_me' => $this->getPreviewAboutMe($order, $dummyData),

            'skills' => $this->getPreviewSkills($order, $dummyData),

            'tools' => $this->getPreviewTools($order, $dummyData),

            'projects' => $this->getPreviewProjects($order, $dummyData),

            'educations' => $this->getPreviewEducations($order, $dummyData),

            'experiences' => $this->getPreviewExperiences($order, $dummyData),

            'certificates' => $this->getPreviewCertificates($order, $dummyData),

            'achievements' => $this->getPreviewAchievements($order, $dummyData),

            'contact' => [
                'email' => $profile->email,
                'nomor_hp' => $profile->nomor_hp,
                'instagram' => $profile->instagram,
                'linkedin' => $profile->linkedin,
                'github' => $profile->github,
                'website' => $profile->website,
            ],
        ];

        return ApiResponse::success($portfolio, 'Portfolio publik berhasil diambil.');
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

    private function getPreviewAboutMe($order, array $dummyData)
    {
        if (in_array($order->paket, ['standard', 'premium']) && $order->portfolioProfile->about_me) {
            return $order->portfolioProfile->about_me;
        }

        return $dummyData['about_me'];
    }

    private function getPreviewSkills($order, array $dummyData)
    {
        if (in_array($order->paket, ['standard', 'premium']) && $order->skills->count() > 0) {
            return $order->skills;
        }

        return $dummyData['skills'];
    }

    private function getPreviewTools($order, array $dummyData)
    {
        if (in_array($order->paket, ['standard', 'premium']) && $order->tools->count() > 0) {
            return $order->tools;
        }

        return $dummyData['tools'];
    }

    private function getPreviewProjects($order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->projects->count() > 0) {
            return $order->projects;
        }

        return $dummyData['projects'];
    }

    private function getPreviewEducations($order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->educations->count() > 0) {
            return $order->educations;
        }

        return $dummyData['educations'];
    }

    private function getPreviewExperiences($order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->experiences->count() > 0) {
            return $order->experiences;
        }

        return $dummyData['experiences'];
    }

    private function getPreviewCertificates($order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->certificates->count() > 0) {
            return $order->certificates;
        }

        return $dummyData['certificates'];
    }

    private function getPreviewAchievements($order, array $dummyData)
    {
        if ($order->paket === 'premium' && $order->achievements->count() > 0) {
            return $order->achievements;
        }

        return $dummyData['achievements'];
    }
}