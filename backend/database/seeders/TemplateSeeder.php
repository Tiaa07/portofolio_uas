<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    public function run(): void
    {
        Template::updateOrCreate(
            [
                'nama_template' => 'Developer Spark Portfolio',
            ],
            [
                'kategori' => 'Developer',
                'deskripsi' => 'Template portfolio modern, colorful, dan energik untuk programmer, web developer, mahasiswa IT, dan freelancer digital.',
                'preview_gambar' => 'templates/developer-spark-preview.png',
                'demo_link' => 'https://buildportfolio.com/demo/developer-spark',
                'harga_basic' => 25000,
                'harga_standard' => 50000,
                'harga_premium' => 100000,
                'status' => 'aktif',
            ]
        );

        Template::updateOrCreate(
            [
                'nama_template' => 'Creative Editorial Portfolio',
            ],
            [
                'kategori' => 'Creative',
                'deskripsi' => 'Template portfolio bergaya editorial, stylish, dan visual untuk UI/UX designer, graphic designer, content creator, dan creative freelancer.',
                'preview_gambar' => 'templates/creative-editorial-preview.png',
                'demo_link' => 'https://buildportfolio.com/demo/creative-editorial',
                'harga_basic' => 30000,
                'harga_standard' => 60000,
                'harga_premium' => 120000,
                'status' => 'aktif',
            ]
        );

        Template::updateOrCreate(
            [
                'nama_template' => 'Minimal Professional Portfolio',
            ],
            [
                'kategori' => 'Professional',
                'deskripsi' => 'Template portfolio minimal, clean, dan profesional untuk mahasiswa, fresh graduate, job seeker, pelamar magang, dan personal branding.',
                'preview_gambar' => 'templates/minimal-professional-preview.png',
                'demo_link' => 'https://buildportfolio.com/demo/minimal-professional',
                'harga_basic' => 25000,
                'harga_standard' => 50000,
                'harga_premium' => 100000,
                'status' => 'aktif',
            ]
        );
    }
}