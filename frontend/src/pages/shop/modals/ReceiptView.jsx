export default function ReceiptView({ order, user }) {
  if (!order || !user) return null;

  return (
    <div className="font-mono text-sm animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black tracking-tighter mb-1">OVEENA.</h2>
        <p className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Premium Essentials Receipt</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 border-y border-slate-100 py-6">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Billed To</p>
          <p className="font-bold text-slate-900 uppercase">{user.name}</p>
          <p className="text-slate-500">{user.email}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Order Info</p>
          <p className="font-bold text-slate-900">#{order.order_number}</p>
          <p className="text-slate-500">
            {new Date(order.created_at).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <table className="w-full mb-10 border-separate border-spacing-y-2">
        <thead className="border-b border-slate-100">
          <tr className="text-[9px] text-slate-400 uppercase">
            <th className="text-left pb-4">Description</th>
            <th className="text-center pb-4">Qty</th>
            <th className="text-right pb-4">Price</th>
            <th className="text-right pb-4">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {order.items?.map((item, i) => (
            <tr key={i}>
              <td className="py-4 font-bold text-slate-800">{item.product?.name}</td>
              <td className="py-4 text-center">{item.quantity}</td>
              <td className="py-4 text-right">${item.price}</td>
              <td className="py-4 text-right font-bold">${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end pt-6 border-t-2 border-slate-900">
        <div className="w-full max-w-[200px] space-y-2">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>${order.total_amount}</span>
          </div>
          <div className="flex justify-between font-black text-lg text-slate-900 pt-2 border-t border-slate-100">
            <span>TOTAL</span>
            <span>${order.total_amount}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center text-[9px] text-slate-400 uppercase tracking-[0.3em]">
        Thank you for choosing OVEENA
      </div>
    </div>
  );
}