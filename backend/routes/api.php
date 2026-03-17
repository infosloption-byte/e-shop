<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\AuthController;
use App\Models\User;
use App\Models\Order;

/*
|--------------------------------------------------------------------------
| Public Routes (No Login Required)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Public Routes for Password Recovery ---
Route::post('/forgot-password', [ProfileController::class, 'sendResetLink']);
Route::post('/reset-password', [ProfileController::class, 'resetPassword']);

// Browsing Products & Categories
Route::get('/categories', [ProductController::class, 'listCategories']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/category/{id}', [ProductController::class, 'getByCategory']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Requires Login)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- Profile & Security ---
    Route::prefix('user')->group(function () {
        // Basic Info Update (Name/Phone)
        Route::put('/profile', [ProfileController::class, 'updateProfile']);
        
        // Security (Password Change)
        Route::put('/password', [ProfileController::class, 'updatePassword']);
        
        // --- Address Management ---
        Route::get('/addresses', [ProfileController::class, 'getAddresses']);
        Route::post('/addresses', [ProfileController::class, 'addAddress']);
        Route::put('/addresses/{id}/default', [ProfileController::class, 'setDefaultAddress']);
        Route::delete('/addresses/{id}', [ProfileController::class, 'deleteAddress']);
        
        // --- Verification (Phone) ---
        Route::post('/phone/send-otp', [ProfileController::class, 'sendPhoneOTP']);
        Route::post('/phone/verify', [ProfileController::class, 'verifyPhoneOTP']);
    });

    Route::get('/user/orders', [OrderController::class, 'userOrders']);
    Route::post('/orders', [OrderController::class, 'store']);

    /*
    |----------------------------------------------------------------------
    | Admin-Only Routes (Requires Login + Admin Flag)
    |----------------------------------------------------------------------
    */
    Route::middleware('admin')->group(function () {
        
        // Admin Dashboard Stats
        Route::get('/admin/stats', function (Request $request) {
            $range = $request->query('range', '30D');
            
            // 1. Basic Totals
            $totalUsers = \App\Models\User::count();
            $totalOrders = \App\Models\Order::count();
            $totalSales = \App\Models\Order::where('status', '!=', 'returned')->sum('total_amount');

            // 2. Prepare the date range template
            $history = [];
            
            if ($range === '6M') {
                // Generate last 6 months (starting from 5 months ago to current)
                for ($i = 5; $i >= 0; $i--) {
                    $dateKey = now()->subMonths($i)->format('Y-m');
                    $displayName = now()->subMonths($i)->format('M Y');
                    $history[$dateKey] = ['name' => $displayName, 'revenue' => 0];
                }

                // Fill with real data
                $realData = \App\Models\Order::where('status', '!=', 'returned')
                    ->where('created_at', '>=', now()->subMonths(6))
                    ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as date, SUM(total_amount) as total")
                    ->groupBy('date')
                    ->get();

                foreach ($realData as $data) {
                    if (isset($history[$data->date])) {
                        $history[$data->date]['revenue'] = (float) $data->total;
                    }
                }
            } else {
                // Generate last 30 days
                for ($i = 29; $i >= 0; $i--) {
                    $dateKey = now()->subDays($i)->format('Y-m-d');
                    $displayName = now()->subDays($i)->format('M d');
                    $history[$dateKey] = ['name' => $displayName, 'revenue' => 0];
                }

                // Fill with real data
                $realData = \App\Models\Order::where('status', '!=', 'returned')
                    ->where('created_at', '>=', now()->subDays(30))
                    ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
                    ->groupBy('date')
                    ->get();

                foreach ($realData as $data) {
                    if (isset($history[$data->date])) {
                        $history[$data->date]['revenue'] = (float) $data->total;
                    }
                }
            }

            return response()->json([
                'total_users' => $totalUsers,
                'total_orders' => $totalOrders,
                'total_sales' => (float)$totalSales,
                'revenue_history' => array_values($history) // Convert associative array to list
            ]);
        });

        Route::get('/admin/users', function() {
            // Return users with their order count to show "Customer Value"
            return \App\Models\User::withCount('orders')->get();
        });

        Route::patch('/admin/users/{id}/role', function(Request $request, $id) {
            $user = \App\Models\User::findOrFail($id);
            
            // Prevent admin from demoting themselves accidentally
            if ($user->id === auth()->id()) {
                return response()->json(['message' => 'You cannot change your own role'], 403);
            }

            $user->update(['role' => $request->role]);
            return response()->json(['message' => 'User role updated']);
        });

        // Full Product & Category Management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::delete('/product-images/{id}', [ProductController::class, 'destroyImage']);
        Route::post('/categories', [ProductController::class, 'storeCategory']);

        // Order Management apis
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    });
});