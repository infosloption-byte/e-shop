import { X, Minus, Plus, ShoppingBag, Trash2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/helpers';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const user = localStorage.getItem('user');

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-indigo-600" />
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Your Bag</h2>
              <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-xs font-bold">{cart.length}</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition text-slate-400 hover:text-slate-900">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <ShoppingBag size={32} />
                </div>
                <p className="text-slate-400 font-medium">Your bag is currently empty.</p>
                <button onClick={onClose} className="text-indigo-600 font-black text-sm hover:underline uppercase tracking-widest">Start Shopping</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <img src={getImageUrl(item)} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={16}/></button>
                    </div>
                    <p className="text-xs text-indigo-600 font-bold mt-1">${item.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-slate-50 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded transition text-slate-500"><Minus size={14}/></button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded transition text-slate-500"><Plus size={14}/></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Estimated Total</span>
                <span className="text-2xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3 pt-2">
                <Link 
                  to="/cart" 
                  onClick={onClose}
                  className="w-full py-4 text-center bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition text-sm"
                >
                  View Full Cart
                </Link>

                {user ? (
                  <Link 
                    to="/checkout" 
                    onClick={onClose}
                    className="w-full py-4 text-center bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition shadow-lg shadow-indigo-100 text-sm"
                  >
                    Checkout Now
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    onClick={onClose}
                    className="w-full py-4 text-center bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm"
                  >
                    <Lock size={16} /> Login to Checkout
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}