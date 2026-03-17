import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { getImageUrl } from '../../utils/helpers';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  
  // Check if user is logged in
  const user = localStorage.getItem('user');

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-black text-slate-800 mb-4">Your bag is empty</h2>
        <Link to="/" className="text-indigo-600 font-bold flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-black text-slate-900 mb-12 uppercase tracking-tighter">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Items List */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-3xl border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-100">
              <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                <img src={getImageUrl(item)} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow flex flex-col justify-between py-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{item.name}</h3>
                    <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">{item.category?.name || 'Essentials'}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-lg transition text-slate-500"><Minus size={16} /></button>
                    <span className="w-10 text-center font-bold text-slate-800">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-lg transition text-slate-500"><Plus size={16} /></button>
                  </div>
                  <p className="text-xl font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-24 shadow-2xl shadow-indigo-100">
            <h3 className="text-xl font-bold mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold uppercase text-xs">Free</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-lg">Total</span>
                <span className="text-3xl font-black">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Login Mandatory Checkout Logic */}
            {user ? (
              <Link 
                to="/checkout"
                className="block w-full py-5 bg-indigo-500 text-white rounded-2xl font-bold text-center hover:bg-indigo-400 transition-colors shadow-xl shadow-indigo-500/20"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-xs text-slate-400 font-medium text-center">
                    Please <Link to="/login" className="text-indigo-400 font-black hover:underline">Login</Link> to complete your order.
                  </p>
                </div>
                <Link 
                  to="/login"
                  className="block w-full py-5 bg-white/10 text-slate-400 rounded-2xl font-bold text-center hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Lock size={16} /> Login to Checkout
                </Link>
              </div>
            )}

            <div className="mt-8 flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={18} className="text-indigo-400" />
              Secure Checkout Powered by OVEENA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}