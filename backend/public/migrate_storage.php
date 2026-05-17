<?php
/**
 * Migrate Storage Files
 * Pindahkan file dari storage/app/public/ ke public/storage/
 * Akses: https://buildportfolio.web.id/migrate_storage.php?key=migrate2024
 * HAPUS file ini setelah selesai!
 */

$secret = $_GET['key'] ?? '';
if ($secret !== 'migrate2024') {
    http_response_code(403);
    die('Forbidden. Tambahkan ?key=migrate2024 ke URL.');
}

echo '<pre style="font-family:monospace;padding:20px;background:#111;color:#0f0;">';
echo "=== MIGRATE STORAGE FILES ===\n\n";

$srcBase  = realpath(__DIR__ . '/../../storage/app/public');
$destBase = __DIR__ . '/storage';

echo "Source : $srcBase\n";
echo "Dest   : $destBase\n\n";

if (!$srcBase || !is_dir($srcBase)) {
    echo "❌ Source storage/app/public tidak ditemukan!\n";
    die('</pre>');
}

if (!is_dir($destBase)) {
    mkdir($destBase, 0755, true);
    echo "✅ Folder public/storage dibuat\n";
} else {
    echo "✅ Folder public/storage sudah ada\n";
}

$copied = 0;
$skipped = 0;
$errors = 0;

function copyRecursive($src, $dest, &$copied, &$skipped, &$errors) {
    if (!is_dir($dest)) {
        mkdir($dest, 0755, true);
    }

    $items = array_diff(scandir($src), ['.', '..', '.gitignore', '.gitkeep']);

    foreach ($items as $item) {
        $srcPath  = $src . '/' . $item;
        $destPath = $dest . '/' . $item;

        if (is_dir($srcPath)) {
            copyRecursive($srcPath, $destPath, $copied, $skipped, $errors);
        } else {
            if (file_exists($destPath)) {
                echo "⏭️  Skip (sudah ada): " . basename($destPath) . "\n";
                $skipped++;
            } else {
                if (copy($srcPath, $destPath)) {
                    echo "✅ Copy: " . str_replace(dirname($src), '', $srcPath) . "\n";
                    $copied++;
                } else {
                    echo "❌ Gagal copy: $srcPath\n";
                    $errors++;
                }
            }
        }
    }
}

echo "\nMemindahkan file...\n";
copyRecursive($srcBase, $destBase, $copied, $skipped, $errors);

echo "\n=== HASIL ===\n";
echo "✅ Berhasil di-copy : $copied file\n";
echo "⏭️  Dilewati        : $skipped file\n";
echo "❌ Gagal            : $errors file\n";

echo "\n=== ISI public/storage/ ===\n";
function listDir($path, $indent = 0) {
    if (!is_dir($path)) return;
    $items = array_diff(scandir($path), ['.', '..']);
    foreach ($items as $item) {
        $fullPath = $path . '/' . $item;
        $prefix = str_repeat('  ', $indent);
        if (is_dir($fullPath)) {
            $count = count(array_diff(scandir($fullPath), ['.', '..']));
            echo "{$prefix}📁 {$item}/ ({$count} items)\n";
            listDir($fullPath, $indent + 1);
        } else {
            $size = number_format(filesize($fullPath) / 1024, 1);
            echo "{$prefix}📄 {$item} ({$size} KB)\n";
        }
    }
}
listDir($destBase);

echo "\n⚠️  HAPUS file migrate_storage.php dari hosting setelah ini!\n";
echo '</pre>';
