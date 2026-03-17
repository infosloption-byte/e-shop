import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/helpers';
import { ShieldCheck, Lock, Truck } from 'lucide-react';
import api from '../../api/axios';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In next step, we'll build this endpoint
      const response = await api.post('/orders', {
        ...formData,
        items: cart,
        total: cartTotal
      });
      clearCart();
      // Redirect to success page
      window.location.href = '/order-success';
    } catch (err) {
      console.error("Order failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping Form */}
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-8">Shipping Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <Input label="Last Name" onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <Input label="Email Address" type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
            <Input label="Street Address" onChange={e => setFormData({...formData, address: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" onChange={e => setFormData({...formData, city: e.target.value})} />
              <Input label="Phone Number" onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            
            <button 
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 lg:p-12 h-fit border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8">In your bag</h3>
          <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-200">
                  <img src={getImageUrl(item)} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                  <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-6 space-y-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="text-emerald-600 font-bold uppercase text-xs">Free</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-slate-900 pt-4 border-t border-slate-200">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Helper Component
function Input({ label, type = "text", onChange }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">{label}</label>
      <input 
        type={type}
        required
        onChange={onChange}
        className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition" 
      />
    </div>
  );
}