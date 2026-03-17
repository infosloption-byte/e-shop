<?php
// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_number', 'total_amount', 'status', 
        'shipping_address', 'phone', 'payment_id', 'payment_status',
        'processed_at', 'shipped_at', 'delivered_at', 'returned_at'
    ];

    protected $casts = [
        'processed_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
        'returned_at' => 'datetime',
    ];

    /**
     * Get the user that placed the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items associated with the order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}