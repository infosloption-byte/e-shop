<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| 🌍 PUBLIC ROUTES (No Authentication Required)
|--------------------------------------------------------------------------
*/

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Browse Products & Categories
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// ⚡ PADDLE WEBHOOK - Must be PUBLIC (no auth, no CSRF)
// This is called by Paddle servers when payment succeeds
Route::post('paddle/webhook', [OrderController::class, 'handlePaddleWebhook']);

/*
|--------------------------------------------------------------------------
| 🔒 PROTECTED ROUTES (Requires Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Profile Management
    Route::put('/user/profile', [ProfileController::class, 'updateProfile']);
    Route::put('/user/password', [ProfileController::class, 'updatePassword']);
    
    // User Orders
    Route::get('/user/orders', [OrderController::class, 'userOrders']);
    Route::post('/orders', [OrderController::class, 'store']); // Creates pending order

    /*
    |----------------------------------------------------------------------
    | 👑 ADMIN ROUTES
    |----------------------------------------------------------------------
    */
    Route::middleware('admin')->prefix('admin')->group(function () {
        
        // Dashboard Stats
        Route::get('/dashboard/stats', [OrderController::class, 'dashboardStats']);

        // Product Management
        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Category Management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Order Management
        Route::get('/orders', [OrderController::class, 'index']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);

        // User Management
        Route::get('/users', [UserController::class, 'index']);
        Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});