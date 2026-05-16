<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Public\TemplateController;
use App\Http\Controllers\Api\Public\PortfolioController as PublicPortfolioController;
use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\TemplateController as AdminTemplateController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\User\DashboardController as UserDashboardController;
use App\Http\Controllers\Api\User\OrderController as UserOrderController;
use App\Http\Controllers\Api\User\PortfolioController as UserPortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'success' => true,
        'message' => 'API Build Portfolio berjalan',
        'data' => [
            'app' => 'Build Portfolio',
            'version' => '1.0.0',
        ],
    ]);
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);

/*
|--------------------------------------------------------------------------
| Public Template Routes
|--------------------------------------------------------------------------
*/

Route::prefix('templates')->group(function () {
    Route::get('/', [TemplateController::class, 'index']);
    Route::get('/search', [TemplateController::class, 'search']);
    Route::get('/{id}', [TemplateController::class, 'show']);
});

Route::get('/portfolio/{slug}', [PublicPortfolioController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']); 

        Route::prefix('templates')->group(function () {
            Route::get('/', [AdminTemplateController::class, 'index']);
            Route::post('/', [AdminTemplateController::class, 'store']);
            Route::get('/{id}', [AdminTemplateController::class, 'show']);
            Route::put('/{id}', [AdminTemplateController::class, 'update']);
            Route::patch('/{id}/toggle-status', [AdminTemplateController::class, 'toggleStatus']);
            Route::delete('/{id}', [AdminTemplateController::class, 'destroy']);
        });

        Route::prefix('orders')->group(function () {
            Route::get('/', [AdminOrderController::class, 'index']);
            Route::get('/{id}', [AdminOrderController::class, 'show']);
            Route::patch('/{id}/approve-payment', [AdminOrderController::class, 'approvePayment']);
            Route::patch('/{id}/reject-payment', [AdminOrderController::class, 'rejectPayment']);
            Route::patch('/{id}/process', [AdminOrderController::class, 'processOrder']);
            Route::patch('/{id}/reject-order', [AdminOrderController::class, 'rejectOrder']);
            Route::put('/{id}/portfolio-data', [AdminOrderController::class, 'updatePortfolioData']);
            Route::get('/{id}/preview-portfolio', [AdminOrderController::class, 'previewPortfolio']);
            Route::patch('/{id}/activate-portfolio-link', [AdminOrderController::class, 'activatePortfolioLink']);
        });
    });

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:user'])
    ->prefix('user')
    ->group(function () {
        Route::get('/dashboard', [UserDashboardController::class, 'index']);

        Route::prefix('orders')->group(function () {
            Route::get('/', [UserOrderController::class, 'index']);
            Route::post('/', [UserOrderController::class, 'store']);
            Route::get('/{id}', [UserOrderController::class, 'show']);
            Route::post('/{id}/upload-payment-proof', [UserOrderController::class, 'uploadPaymentProof']);
        });

        Route::prefix('portfolios')->group(function () {
            Route::get('/', [UserPortfolioController::class, 'index']);
            Route::get('/{id}', [UserPortfolioController::class, 'show']);
        });
    });