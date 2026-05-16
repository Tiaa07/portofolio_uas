<?php

use App\Models\Order;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('_hosting')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])
    ->group(function () {
        $authorize = static function () {
            $maintenanceKey = (string) config('app.hosting_maintenance_key', '');

            if ($maintenanceKey === '') {
                abort(404);
            }

            if (!hash_equals($maintenanceKey, (string) request('key', ''))) {
                abort(403, 'Maintenance key tidak valid.');
            }
        };

        $runCommand = static function (string $command, array $parameters = []) {
            Artisan::call($command, $parameters);

            return [
                'command' => trim($command.' '.collect($parameters)
                    ->map(fn ($value, $key) => is_bool($value) ? ($value ? $key : '') : "{$key}={$value}")
                    ->filter()
                    ->implode(' ')),
                'output' => trim(Artisan::output()),
            ];
        };

        $cleanStoragePath = static function (?string $path): string {
            $cleanedPath = str_replace('\\', '/', trim((string) $path));
            $cleanedPath = preg_replace('#^https?://[^/]+/#', '', $cleanedPath);
            $cleanedPath = ltrim($cleanedPath, '/');

            foreach ([
                'storage/app/public/',
                'app/public/',
                'public/storage/',
                'storage/',
                'public/',
            ] as $prefix) {
                if (str_starts_with($cleanedPath, $prefix)) {
                    $cleanedPath = substr($cleanedPath, strlen($prefix));
                    break;
                }
            }

            return ltrim($cleanedPath, '/');
        };

        Route::get('/status', function () use ($authorize) {
            $authorize();

            $publicStorage = public_path('storage');
            $storagePublic = storage_path('app/public');

            return response()->json([
                'success' => true,
                'data' => [
                    'app_url' => config('app.url'),
                    'public_storage_path' => $publicStorage,
                    'storage_public_path' => $storagePublic,
                    'public_storage_exists' => file_exists($publicStorage),
                    'public_storage_is_link' => is_link($publicStorage),
                    'public_storage_is_file' => is_file($publicStorage),
                    'public_storage_is_dir' => is_dir($publicStorage),
                    'storage_public_exists' => is_dir($storagePublic),
                ],
            ]);
        });

        Route::get('/migrate', function () use ($authorize, $runCommand) {
            $authorize();

            return response()->json([
                'success' => true,
                'message' => 'Migrate selesai dijalankan.',
                'results' => [
                    $runCommand('migrate', ['--force' => true]),
                ],
            ]);
        });

        Route::get('/seed', function () use ($authorize, $runCommand) {
            $authorize();

            return response()->json([
                'success' => true,
                'message' => 'Seeder selesai dijalankan.',
                'results' => [
                    $runCommand('db:seed', ['--force' => true]),
                ],
            ]);
        });

        Route::get('/migrate-seed', function () use ($authorize, $runCommand) {
            $authorize();

            return response()->json([
                'success' => true,
                'message' => 'Migrate dan seeder selesai dijalankan.',
                'results' => [
                    $runCommand('migrate', ['--force' => true]),
                    $runCommand('db:seed', ['--force' => true]),
                ],
            ]);
        });

        Route::get('/clear', function () use ($authorize, $runCommand) {
            $authorize();

            return response()->json([
                'success' => true,
                'message' => 'Cache Laravel selesai dibersihkan.',
                'results' => [
                    $runCommand('optimize:clear'),
                    $runCommand('config:clear'),
                    $runCommand('cache:clear'),
                    $runCommand('route:clear'),
                    $runCommand('view:clear'),
                ],
            ]);
        });

        Route::get('/storage-link', function () use ($authorize, $runCommand) {
            $authorize();

            $publicStorage = public_path('storage');

            if ((is_file($publicStorage) || is_link($publicStorage)) && !is_dir($publicStorage)) {
                File::delete($publicStorage);
            }

            return response()->json([
                'success' => true,
                'message' => 'Storage link selesai diproses.',
                'results' => [
                    $runCommand('storage:link', ['--force' => true]),
                ],
                'data' => [
                    'public_storage_path' => $publicStorage,
                    'public_storage_exists' => file_exists($publicStorage),
                    'public_storage_is_link' => is_link($publicStorage),
                    'storage_public_path' => storage_path('app/public'),
                ],
            ]);
        });

        Route::get('/storage-check', function () use ($authorize, $cleanStoragePath) {
            $authorize();

            $path = (string) request('path', '');
            $cleanedPath = $cleanStoragePath($path);

            if ($cleanedPath === '' || str_contains($cleanedPath, '..')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Path storage tidak valid.',
                    'data' => [
                        'input_path' => $path,
                        'cleaned_path' => $cleanedPath,
                    ],
                ], 422);
            }

            $absolutePath = storage_path('app/public/'.$cleanedPath);
            $directory = dirname($absolutePath);
            $basename = basename($absolutePath);

            return response()->json([
                'success' => true,
                'data' => [
                    'input_path' => $path,
                    'cleaned_path' => $cleanedPath,
                    'public_url' => url('/storage/'.$cleanedPath),
                    'absolute_path' => $absolutePath,
                    'directory' => $directory,
                    'directory_exists' => is_dir($directory),
                    'file_exists' => is_file($absolutePath),
                    'file_size' => is_file($absolutePath) ? filesize($absolutePath) : null,
                    'mime_type' => is_file($absolutePath) ? File::mimeType($absolutePath) : null,
                    'same_folder_files' => is_dir($directory)
                        ? collect(File::files($directory))
                            ->map(fn ($file) => $file->getFilename())
                            ->filter(fn ($filename) => $filename === $basename || str_contains($filename, pathinfo($basename, PATHINFO_FILENAME)))
                            ->values()
                            ->take(20)
                        : [],
                    'latest_folder_files' => is_dir($directory)
                        ? collect(File::files($directory))
                            ->sortByDesc(fn ($file) => $file->getMTime())
                            ->map(fn ($file) => [
                                'name' => $file->getFilename(),
                                'size' => $file->getSize(),
                                'modified' => date('Y-m-d H:i:s', $file->getMTime()),
                            ])
                            ->values()
                            ->take(20)
                        : [],
                ],
            ]);
        });

        Route::get('/storage-test', function () use ($authorize) {
            $authorize();

            $path = 'hosting-test/storage-test.png';
            $absolutePath = storage_path('app/public/'.$path);

            File::ensureDirectoryExists(dirname($absolutePath));

            file_put_contents(
                $absolutePath,
                base64_decode('iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAABM5OhcAAAACXBIWXMAAAsTAAALEwEAmpwYAAABhElEQVR4nO3WsQ2AMBAEQYf/f9mQUJCKKThnSwsYzJ7NXWVZAAAAAAAAAAAAAAAAAAAAAADwde55vz8B8CUXb7lzqP+2e0C8CYmQCBMSYUISJCTChCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJSZCQCBOSICEJJiTBhCRISIQJ6XvZ3QH2mzS8VAAAAABJRU5ErkJggg==')
            );

            return response()->json([
                'success' => true,
                'message' => 'File test berhasil dibuat di storage public.',
                'data' => [
                    'path' => $path,
                    'url' => url('/storage/'.$path),
                    'absolute_path' => $absolutePath,
                    'file_exists' => is_file($absolutePath),
                    'file_size' => is_file($absolutePath) ? filesize($absolutePath) : null,
                    'mime_type' => is_file($absolutePath) ? File::mimeType($absolutePath) : null,
                ],
            ]);
        });

        Route::get('/order-media-check/{order}', function ($orderId) use ($authorize, $cleanStoragePath) {
            $authorize();

            $order = Order::with([
                'portfolioProfile',
                'projects',
                'certificates',
                'payment',
            ])->find($orderId);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order tidak ditemukan.',
                ], 404);
            }

            $inspectFile = static function (string $label, ?string $path) use ($cleanStoragePath) {
                $cleanedPath = $cleanStoragePath($path);
                $absolutePath = $cleanedPath ? storage_path('app/public/'.$cleanedPath) : null;

                return [
                    'label' => $label,
                    'db_path' => $path,
                    'cleaned_path' => $cleanedPath,
                    'url' => $cleanedPath ? url('/storage/'.$cleanedPath) : null,
                    'absolute_path' => $absolutePath,
                    'file_exists' => $absolutePath ? is_file($absolutePath) : false,
                    'file_size' => $absolutePath && is_file($absolutePath) ? filesize($absolutePath) : null,
                    'mime_type' => $absolutePath && is_file($absolutePath) ? File::mimeType($absolutePath) : null,
                ];
            };

            $media = [
                $inspectFile('foto_profil', $order->portfolioProfile?->foto_profil),
                $inspectFile('foto_bukti_pembayaran', $order->payment?->foto_bukti_pembayaran),
            ];

            foreach ($order->projects as $project) {
                $media[] = $inspectFile('project_'.$project->id, $project->gambar_project);
            }

            foreach ($order->certificates as $certificate) {
                $media[] = $inspectFile('certificate_'.$certificate->id, $certificate->file_sertifikat);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'order_id' => $order->id,
                    'kode_order' => $order->kode_order,
                    'media' => $media,
                ],
            ]);
        });

        Route::get('/setup', function () use ($authorize, $runCommand) {
            $authorize();

            $publicStorage = public_path('storage');

            if ((is_file($publicStorage) || is_link($publicStorage)) && !is_dir($publicStorage)) {
                File::delete($publicStorage);
            }

            return response()->json([
                'success' => true,
                'message' => 'Setup hosting selesai dijalankan.',
                'results' => [
                    $runCommand('optimize:clear'),
                    $runCommand('migrate', ['--force' => true]),
                    $runCommand('storage:link', ['--force' => true]),
                ],
            ]);
        });
    });

Route::get('/storage/{path}', function (string $path) {
    $storageRoot = realpath(storage_path('app/public'));
    $requestedPath = realpath(storage_path('app/public/'.$path));
    $isInsideStorage = $storageRoot
        && $requestedPath
        && ($requestedPath === $storageRoot || str_starts_with($requestedPath, $storageRoot.DIRECTORY_SEPARATOR));

    if (!$isInsideStorage || !is_file($requestedPath)) {
        abort(404);
    }

    return response()->file($requestedPath, [
        'Cache-Control' => 'public, max-age=604800',
    ]);
})->where('path', '.*');

Route::get('/media/{path}', function (string $path) {
    $storageRoot = realpath(storage_path('app/public'));
    $requestedPath = realpath(storage_path('app/public/'.$path));
    $isInsideStorage = $storageRoot
        && $requestedPath
        && ($requestedPath === $storageRoot || str_starts_with($requestedPath, $storageRoot.DIRECTORY_SEPARATOR));

    if (!$isInsideStorage || !is_file($requestedPath)) {
        abort(404);
    }

    return response()->file($requestedPath, [
        'Cache-Control' => 'public, max-age=604800',
    ]);
})->where('path', '.*');
