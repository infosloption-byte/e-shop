<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Mail\OrderPlacedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of orders with filtering.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user:id,name,email', 'items.product']);

        if ($request->has('order_number') && $request->order_number != '') {
            $query->where('order_number', 'like', '%' . $request->order_number . '%');
        }

        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('start_date') && $request->has('end_date') && $request->start_date != '' && $request->end_date != '') {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        }

        $orders = $query->latest()->get();
        return response()->json($orders);
    }

    /**
     * Create pending order BEFORE payment (called from frontend checkout)
     */
    public function store(Request $request)
    {
        $request->validate([
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|email',
            'address' => 'required|string',
            'city' => 'required|string',
            'phone' => 'required|string',
            'items' => 'required|array|min:1',
            'total' => 'required|numeric',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $order = Order::create([
                    'user_id' => auth()->id(), 
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                    'total_amount' => $request->total,
                    'status' => 'pending',
                    'shipping_address' => $request->address . ', ' . $request->city,
                    'phone' => $request->phone,
                    'payment_status' => 'pending',
                ]);

                foreach ($request->items as $item) {
                    $product = Product::find($item['id']);
                    
                    if (!$product) {
                        throw new \Exception("Product not found: " . $item['id']);
                    }
                    
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Insufficient stock for product: " . $product->name);
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }

                Log::info('Pending order created', [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number
                ]);

                return response()->json([
                    'success' => true,
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'amount' => $order->total_amount,
                    'customer' => [
                        'name' => $request->firstName . ' ' . $request->lastName,
                        'email' => $request->email,
                    ]
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Order creation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * ⚡ PADDLE WEBHOOK - Called by Paddle when payment succeeds
     * This is the MOST IMPORTANT method for payment processing!
     */
    public function handlePaddleWebhook(Request $request)
    {
        Log::info('🔔 Paddle Webhook Received', [
            'event_type' => $request->input('event_type'),
            'full_payload' => $request->all()
        ]);

        try {
            // Paddle sends different event types
            $eventType = $request->input('event_type');
            
            // Only process successful payments
            if ($eventType !== 'transaction.completed') {
                Log::info('ℹ️ Ignoring event: ' . $eventType);
                return response()->json(['message' => 'Event ignored'], 200);
            }

            // Get custom_data from Paddle webhook
            // Paddle sends: data.custom_data (as object/array)
            $data = $request->input('data');
            $customData = $data['custom_data'] ?? null;
            
            Log::info('📦 Custom Data Received', ['custom_data' => $customData]);
            
            if (!$customData || !isset($customData['order_id'])) {
                Log::error('❌ No order_id in webhook custom_data', [
                    'data_keys' => $data ? array_keys($data) : 'no data',
                    'custom_data' => $customData
                ]);
                return response()->json(['error' => 'No order ID'], 400);
            }

            $orderId = $customData['order_id'];
            $order = Order::find($orderId);

            if (!$order) {
                Log::error('❌ Order not found', ['order_id' => $orderId]);
                return response()->json(['error' => 'Order not found'], 404);
            }

            // Prevent double-processing
            if ($order->payment_status === 'paid') {
                Log::info('✅ Order already processed', [
                    'order_number' => $order->order_number
                ]);
                return response()->json(['message' => 'Already processed'], 200);
            }

            // 🔥 PROCESS THE PAYMENT
            DB::transaction(function () use ($order, $request, $data) {
                // 1. Update order status
                $order->update([
                    'payment_id' => $data['id'] ?? null,
                    'payment_status' => 'paid',
                    'status' => 'on-processing',
                    'processed_at' => now(),
                ]);

                Log::info('💰 Payment confirmed', [
                    'order_number' => $order->order_number,
                    'payment_id' => $data['id'] ?? 'unknown'
                ]);

                // 2. Deduct stock (CRITICAL!)
                foreach ($order->items as $item) {
                    $product = Product::find($item->product_id);
                    
                    if ($product && $product->stock >= $item->quantity) {
                        $product->decrement('stock', $item->quantity);
                        
                        Log::info('📦 Stock deducted', [
                            'product' => $product->name,
                            'qty_sold' => $item->quantity,
                            'remaining' => $product->fresh()->stock
                        ]);
                    }
                }

                // 3. Send confirmation email
                try {
                    // Mail::to($order->user->email)->send(new OrderPlacedMail($order));
                    // Log::info('📧 Email sent to ' . $order->user->email);
                } catch (\Exception $e) {
                    Log::error('❌ Email failed: ' . $e->getMessage());
                }
            });

            Log::info('✅ Order processing complete!', [
                'order_number' => $order->order_number
            ]);

            return response()->json(['success' => true], 200);

        } catch (\Exception $e) {
            Log::error('❌ Webhook failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['error' => 'Processing failed'], 500);
        }
    }

    /**
     * Get user's orders
     */
    public function userOrders()
    {
        $orders = Order::where('user_id', auth()->id())
            ->with(['items.product.images'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    /**
     * Show single order
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.product.images'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,on-processing,on-delivery,delivered,returned'
        ]);

        $order = Order::findOrFail($id);
        $status = $request->status;

        $timestampMap = [
            'on-processing' => 'processed_at',
            'on-delivery'   => 'shipped_at',
            'delivered'     => 'delivered_at',
            'returned'      => 'returned_at',
        ];

        if (isset($timestampMap[$status])) {
            $column = $timestampMap[$status];
            if (!$order->$column) {
                $order->$column = now();
            }
        }

        $order->status = $status;
        $order->save();

        return response()->json([
            'message' => 'Order status updated',
            'order' => $order->load(['user', 'items.product'])
        ]);
    }

    /**
     * Delete order
     */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Order deleted successfully']);
    }
}