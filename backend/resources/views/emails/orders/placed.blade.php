<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f1f5f9;">
    <h1 style="font-weight: 900; letter-spacing: -1px;">OVEENA.</h1>
    <p style="color: #64748b; font-size: 14px;">Order Confirmed: #{{ $order->order_number }}</p>
    
    <div style="margin: 40px 0; padding: 20px; background: #f8fafc; border-radius: 20px;">
        <h3 style="font-size: 10px; text-transform: uppercase; color: #94a3b8;">Shipping To</h3>
        <p style="font-weight: bold; margin: 5px 0;">{{ $order->shipping_address }}</p>
    </div>

    <table style="width: 100%; font-family: monospace; border-collapse: collapse;">
        @foreach($order->items as $item)
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0;">{{ $item->product->name }} x{{ $item->quantity }}</td>
            <td style="text-align: right;">${{ number_format($item->price * $item->quantity, 2) }}</td>
        </tr>
        @endforeach
        <tr>
            <td style="padding-top: 20px; font-weight: 900;">TOTAL</td>
            <td style="padding-top: 20px; text-align: right; font-weight: 900; color: #4f46e5;">${{ $order->total_amount }}</td>
        </tr>
    </table>

    <p style="margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; text-transform: uppercase;">
        Thank you for your purchase.
    </p>
</div>