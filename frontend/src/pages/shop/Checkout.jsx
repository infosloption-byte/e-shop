import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/helpers';
import { ShieldCheck, Lock, Truck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    console.log('=== PADDLE DEBUG INFO ===');
    console.log('Client Token:', import.meta.env.VITE_PADDLE_CLIENT_TOKEN);
    console.log('Price ID:', import.meta.env.VITE_PADDLE_PRICE_ID);
    console.log('Token starts with test_?', import.meta.env.VITE_PADDLE_CLIENT_TOKEN?.startsWith('test_'));
    console.log('========================');
  }, []);

  // Load Paddle.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = () => {
      if (window.Paddle) {
        // Paddle v2 Setup - NO environment parameter!
        // Environment is automatically detected from token:
        // - Sandbox tokens start with 'test_'
        // - Live tokens start with 'live_'
        window.Paddle.Setup({ 
          token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN
        });
        setPaddleLoaded(true);
        console.log('✅ Paddle.js loaded successfully');
      }
    };
    script.onerror = () => {
      showToast("Failed to load payment system. Please refresh the page.", "error");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length < 2 ? 'Must be at least 2 characters' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : '';
      case 'phone':
        return !/^[\d\s\-\+\(\)]{10,}$/.test(value) ? 'Invalid phone number' : '';
      case 'address':
        return value.trim().length < 5 ? 'Please enter complete address' : '';
      case 'city':
        return value.trim().length < 2 ? 'Please enter city' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Please fix the form errors", "error");
      return;
    }

    if (!paddleLoaded) {
      showToast("Payment system is loading, please wait...", "info");
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create pending order in backend
      const orderResponse = await api.post('/orders', {
        ...formData,
        items: cart,
        total: cartTotal
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Order creation failed');
      }

      const { order_id, order_number, amount, customer } = orderResponse.data;

      console.log('💰 Opening Paddle checkout for amount:', amount);

      // Step 2: Open Paddle Checkout with DYNAMIC AMOUNT
      // Using quantity to multiply $1.00 base price
      // $99.99 cart → quantity: 9999 → charges $99.99
      const quantityInCents = Math.round(amount * 100);

      window.Paddle.Checkout.open({
        items: [{
          priceId: import.meta.env.VITE_PADDLE_PRICE_ID,
          quantity: quantityInCents // Multiply $1.00 base price by this
        }],
        customData: {
          order_id: order_id,
          order_number: order_number
        },
        customer: {
          email: customer.email,
        },
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
          successUrl: `${window.location.origin}/order-success?order=${order_number}`,
        }
      });

      // Clear cart optimistically when Paddle checkout opens
      clearCart();
      setLoading(false);
      
    } catch (err) {
      console.error("Order creation failed", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Failed to initiate checkout";
      showToast(errorMsg, "error");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping Form */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Shipping Details</h2>
            <p className="text-slate-500 text-sm">Please provide accurate delivery information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="First Name" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && errors.firstName}
                required
              />
              <FormInput 
                label="Last Name" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && errors.lastName}
                required
              />
            </div>

            <FormInput 
              label="Email Address" 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              hint="Order confirmation will be sent here"
              required
            />

            <FormInput 
              label="Street Address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && errors.address}
              placeholder="House number and street name"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput 
                label="City" 
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.city && errors.city}
                required
              />
              <FormInput 
                label="Phone Number" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            {/* Payment Security Notice */}
            <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <Lock className="text-indigo-600 mt-0.5 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-indigo-900 mb-1">Secure Payment via Paddle</p>
                <p className="text-xs text-indigo-700">
                  Your payment information is encrypted and processed securely. We never store your card details.
                </p>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading || !paddleLoaded || cart.length === 0}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing Order...
                </>
              ) : !paddleLoaded ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Loading Payment System...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  Complete Purchase ${cartTotal.toFixed(2)}
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </>
              )}
            </button>

            {!paddleLoaded && (
              <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={12} />
                Initializing secure payment gateway...
              </p>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 lg:p-12 h-fit border border-slate-100 sticky top-24">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Order Summary</h3>
          
          <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-200 shrink-0">
                  <img src={getImageUrl(item)} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                  <p className="text-slate-500 text-xs">Qty: {item.quantity} × ${item.price}</p>
                </div>
                <p className="font-bold text-slate-800 shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
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
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span className="text-slate-500 text-xs">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-slate-900 pt-4 border-t border-slate-200">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3 text-slate-400 text-xs">
            <Truck className="shrink-0 mt-0.5" size={16} />
            <p>
              Free standard shipping on all orders. Estimated delivery in 5-7 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Form Input Component
function FormInput({ label, error, hint, className = '', ...props }) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input 
          {...props}
          className={`w-full p-4 bg-white border rounded-2xl outline-none transition ${
            error 
              ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500' 
              : 'border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
        />
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <AlertCircle size={18} className="text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-slate-400 mt-1 ml-1">{hint}</p>
      )}
    </div>
  );
}