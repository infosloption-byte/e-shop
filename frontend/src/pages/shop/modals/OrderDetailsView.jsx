import { getImageUrl } from '../../../utils/helpers';

export default function OrderDetailsView({ order }) {
  if (!order) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Destination</p>
          <p className="font-bold text-slate-900 leading-relaxed">
            {order.shipping_address}<br />
            Phone: {order.phone}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
          <p className="font-black text-slate-900 uppercase italic">{order.status}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Items</p>
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-2">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                <img 
                  src={getImageUrl(item.product)} 
                  className="w-full h-full object-cover" 
                  alt={item.product?.name} 
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.product?.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price}</p>
              </div>
            </div>
            <p className="font-bold text-slate-900">${(item.quantity * item.price).toFixed(2)}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
        <p className="font-black text-slate-900 uppercase">Total Amount</p>
        <p className="text-2xl font-black text-indigo-600">${order.total_amount}</p>
      </div>
    </div>
  );
}