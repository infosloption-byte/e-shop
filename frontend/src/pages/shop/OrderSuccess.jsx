import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle size={48} />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Order Confirmed!</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          Thank you for your purchase. We've received your order and are getting it ready for shipment. You can track its status in your account.
        </p>

        <div className="space-y-4">
          {/* UPDATED: Redirects to Account Center and passes 'orders' as the active tab */}
          <Link 
            to="/account" 
            state={{ tab: 'orders' }}
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-200"
          >
            <Package size={20} /> View Order History
          </Link>
          
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 w-full py-4 text-slate-600 font-bold hover:text-indigo-600 transition"
          >
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}