<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of orders with filtering.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user:id,name,email', 'items.product']);

        // Filter by Order Number (Search)
        if ($request->has('order_number') && $request->order_number != '') {
            $query->where('order_number', 'like', '%' . $request->order_number . '%');
        }

        // Filter by Status
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        // Filter by Date Range
        if ($request->has('start_date') && $request->has('end_date') && $request->start_date != '' && $request->end_date != '') {
            $query->whereBetween('created_at', [$request->start_date . ' 00:00:00', $request->end_date . ' 23:59:59']);
        }

        $orders = $query->latest()->get();

        return response()->json($orders);
    }

    /**
     * Store a newly created order (Checkout).
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
                // 1. Create the Order
                $order = Order::create([
                    // Use authenticated user ID or fallback to a default/null if guest checkout is allowed
                    'user_id' => auth()->id(), 
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                    'total_amount' => $request->total,
                    'status' => 'on-processing',
                    'shipping_address' => $request->address . ', ' . $request->city,
                    'phone' => $request->phone,
                ]);

                // 2. Attach items and update stock
                foreach ($request->items as $item) {
                    // Create Order Item
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'], // Snapshot price at time of purchase
                    ]);

                    // Deduct stock from Product
                    $product = Product::find($item['id']);
                    if ($product) {
                        if ($product->stock < $item['quantity']) {
                            throw new \Exception("Insufficient stock for product: " . $product->name);
                        }
                        $product->decrement('stock', $item['quantity']);
                    }
                }

                Mail::to($request->user())->send(new OrderPlacedMail($order));

                return response()->json([
                    'message' => 'Order placed successfully',
                    'order_number' => $order->order_number
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to place order',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function userOrders()
    {
        // Retrieve orders for the logged-in user with their items
        $orders = Order::where('user_id', auth()->id())
            ->with(['items.product'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    /**
     * Display the specified order details.
     */
    public function show($id)
    {
        $order = Order::with([
            'user', 
            'items.product.images' 
        ])->findOrFail($id);

        return response()->json($order);
    }

    /**
     * Update the order status (Tracking).
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

        // Update timestamp if applicable
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
     * Delete an order.
     */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        
        return response()->json(['message' => 'Order deleted successfully']);
    }
}