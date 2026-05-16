<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\Template;
use App\Models\Payment;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioCertificate;
use App\Models\PortfolioSkill;
use App\Models\PortfolioEducation;
use App\Models\PortfolioExperience;
use App\Models\PortfolioAchievement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DummyOrderSeeder extends Seeder
{
    public function run(): void
    {
        echo "--- Memulai Seeding Data Dummy ---\n";
        
        $templates = Template::all();
        if ($templates->isEmpty()) {
            echo "Template kosong, menjalankan TemplateSeeder...\n";
            $this->call(TemplateSeeder::class);
            $templates = Template::all();
            
            if ($templates->isEmpty()) {
                echo "ERROR: Gagal membuat Template. Seeder dihentikan.\n";
                return;
            }
        }

        for ($i = 1; $i <= 10; $i++) {
            echo "Membuat Order #$i...\n";
            
            try {
                $user = User::create([
                    'name' => 'User Dummy ' . $i . ' ' . Str::random(4),
                    'email' => 'user' . $i . '_' . time() . '@example.com',
                    'password' => Hash::make('password123'),
                    'role' => 'user',
                    'status' => 'aktif',
                ]);

                $statusPesanan = ['pending', 'diproses', 'selesai', 'ditolak'][rand(0, 3)];
                $statusPembayaran = ($statusPesanan === 'pending') ? 'belum_bayar' : 'lunas';
                if ($statusPesanan === 'ditolak') $statusPembayaran = 'ditolak';

                $order = Order::create([
                    'kode_order' => 'ORDER-' . strtoupper(Str::random(8)),
                    'user_id' => $user->id,
                    'template_id' => $templates->random()->id,
                    'paket' => ['basic', 'standard', 'premium'][rand(0, 2)],
                    'harga_paket' => rand(25000, 150000),
                    'status_pesanan' => $statusPesanan,
                    'status_pembayaran' => $statusPembayaran,
                    'created_at' => now()->subDays(rand(1, 30)),
                ]);

                if ($statusPembayaran !== 'belum_bayar') {
                    Payment::create([
                        'order_id' => $order->id,
                        'metode_pembayaran' => 'Transfer Bank',
                        'bank_atau_ewallet_pengirim' => 'BCA',
                        'nomor_pengirim' => '1234567890',
                        'nama_pengirim' => $user->name,
                        'jumlah_pembayaran' => $order->harga_paket,
                        'tanggal_pembayaran' => $order->created_at->addHours(2),
                        'foto_bukti_pembayaran' => 'payments/bukti-pembayaran/dummy.png',
                        'status' => $statusPembayaran,
                    ]);
                }

                PortfolioProfile::create([
                    'order_id' => $order->id,
                    'nama_lengkap' => $user->name,
                    'profesi' => 'Fullstack Developer',
                    'email' => $user->email,
                    'nomor_hp' => '08123456789' . $i,
                    'about_me' => 'Halo, saya adalah seorang developer yang berpengalaman.',
                    'foto_profil' => 'portfolio/foto-profil/dummy.png',
                ]);

                for ($j = 1; $j <= 2; $j++) {
                    PortfolioProject::create([
                        'order_id' => $order->id,
                        'nama_project' => 'Project Mantap ' . $j,
                        'deskripsi_project' => 'Deskripsi untuk project mantap nomor ' . $j,
                        'link_project' => 'https://github.com/dummy/project-' . $j,
                        'gambar_project' => 'portfolio/project/dummy.png',
                    ]);
                }

                for ($k = 1; $k <= 2; $k++) {
                    PortfolioCertificate::create([
                        'order_id' => $order->id,
                        'nama_sertifikat' => 'Sertifikat Ahli ' . $k,
                        'penerbit' => 'Dicoding Indonesia',
                        'tahun' => '202' . rand(0, 4),
                        'file_sertifikat' => 'portfolio/certificate/dummy.png',
                    ]);
                }

                PortfolioEducation::create([
                    'order_id' => $order->id,
                    'nama_sekolah' => 'Universitas Indonesia',
                    'jurusan' => 'Teknik Informatika',
                    'tahun_mulai' => '2018',
                    'tahun_selesai' => '2022',
                    'deskripsi' => 'Lulus dengan pujian.',
                ]);

                PortfolioExperience::create([
                    'order_id' => $order->id,
                    'nama_tempat' => 'Google Indonesia',
                    'posisi' => 'Software Engineer',
                    'deskripsi' => 'Membangun fitur-fitur keren.',
                    'tahun_mulai' => '2022',
                    'tahun_selesai' => 'Sekarang',
                ]);

                PortfolioAchievement::create([
                    'order_id' => $order->id,
                    'nama_pencapaian' => 'Juara 1 Hackathon',
                    'deskripsi' => 'Memenangkan kompetisi.',
                    'tahun' => '2023',
                ]);

                foreach (['React', 'Laravel', 'Node.js'] as $skill) {
                    PortfolioSkill::create([
                        'order_id' => $order->id,
                        'nama_skill' => $skill,
                        'level_skill' => 'Advanced',
                    ]);
                }
                
                echo "  -> Berhasil membuat Order #$i\n";
                
            } catch (\Exception $e) {
                echo "  -> ERROR pada Order #$i: " . $e->getMessage() . "\n";
            }
        }
        
        echo "--- Seeding Data Dummy Selesai! ---\n";
    }
}
