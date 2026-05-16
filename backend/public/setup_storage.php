<?php
/**
 * Storage Link Setup Script
 * Upload ke public/ hosting, akses via browser SEKALI, lalu HAPUS!
 * URL: https://buildportfolio.web.id/setup_storage.php
 */

// Keamanan dasar
$secret = $_GET['key'] ?? '';
if ($secret !== 'setupstorage2024') {
    http_response_code(403);
    die('Forbidden. Tambahkan ?key=setupstorage2024 ke URL.');
}

$publicPath  = __DIR__;
$storagePath = realpath(__DIR__ . '/../storage/app/public');
$linkPath    = $publicPath . '/storage';

echo '<pre style="font-family:monospace;padding:20px;">';
echo "=== STORAGE LINK SETUP ===\n\n";
echo "Public dir  : $publicPath\n";
echo "Storage dir : $storagePath\n";
echo "Link target : $linkPath\n\n";

// Cek storage/app/public ada
if (!$storagePath || !is_dir($storagePath)) {
    echo "❌ ERROR: storage/app/public tidak ditemukan!\n";
    echo "   Path yang dicoba: " . __DIR__ . "/../storage/app/public\n";
    die('</pre>');
}
echo "✅ storage/app/public ditemukan\n";

// Cek apakah link sudah ada
if (is_link($linkPath)) {
    $existing = readlink($linkPath);
    echo "ℹ️  Symlink sudah ada → $existing\n";
    echo "   Apakah symlink valid? " . (is_dir($linkPath) ? "✅ Ya" : "❌ Tidak valid") . "\n";

    if (!is_dir($linkPath)) {
        echo "   Menghapus symlink yang rusak...\n";
        unlink($linkPath);
        echo "   ✅ Symlink lama dihapus\n";
    } else {
        echo "\n✅ Symlink sudah berfungsi! Tidak perlu setup ulang.\n";
        testFiles($linkPath);
        die('</pre>');
    }
} elseif (is_dir($linkPath)) {
    echo "⚠️  Ada folder 'storage' di public/ (bukan symlink)\n";
    echo "   Tidak dihapus otomatis untuk keamanan. Hapus manual via cPanel.\n";
    die('</pre>');
} elseif (file_exists($linkPath)) {
    echo "⚠️  Ada file bernama 'storage' di public/ — menghapus...\n";
    unlink($linkPath);
}

// Buat symlink
echo "\nMembuat symlink...\n";
if (symlink($storagePath, $linkPath)) {
    echo "✅ Symlink berhasil dibuat!\n";
    echo "   $linkPath → $storagePath\n";
} else {
    echo "❌ symlink() gagal. Mencoba cara alternatif...\n";

    // Coba relative symlink
    $relative = '../storage/app/public';
    if (@symlink($relative, $linkPath)) {
        echo "✅ Symlink relatif berhasil: $linkPath → $relative\n";
    } else {
        echo "❌ Semua cara gagal. Kemungkinan server tidak izinkan symlink.\n";
        echo "   Coba buat symlink manual via cPanel File Manager:\n";
        echo "   - Masuk ke public_html/[folder_backend]/public/\n";
        echo "   - Klik New Symlink\n";
        echo "   - Target: ../storage/app/public\n";
        echo "   - Symlink name: storage\n";
        die('</pre>');
    }
}

echo "\n=== CEK FILE ===\n";
testFiles($linkPath);

echo "\n=== SELESAI ===\n";
echo "⚠️  PENTING: Hapus file setup_storage.php dari hosting setelah ini!\n";
echo '</pre>';

function testFiles($linkPath) {
    $subdirs = ['payments', 'profile', 'foto_profil', 'sertifikat', 'bukti-pembayaran'];
    foreach ($subdirs as $sub) {
        $path = $linkPath . '/' . $sub;
        if (is_dir($path)) {
            $files = array_diff(scandir($path), ['.', '..']);
            echo "📁 storage/$sub/ — " . count($files) . " file(s)\n";
            foreach (array_slice($files, 0, 3) as $f) {
                echo "   • $f\n";
            }
        }
    }

    // List semua folder di storage
    echo "\nSemua folder di storage/:\n";
    if (is_dir($linkPath)) {
        $items = array_diff(scandir($linkPath), ['.', '..']);
        foreach ($items as $item) {
            $type = is_dir($linkPath . '/' . $item) ? '📁' : '📄';
            echo "  $type $item\n";
        }
    }
}
