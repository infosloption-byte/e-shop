import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package, Truck, Clock, Mail, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/helpers';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get('/user/orders');
      const foundOrder = response.data.find(o => o.order_number === orderNumber);
      setOrder(foundOrder);
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle size={48} />
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
            Order Confirmed!
          </h1>
          
          {order && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold mb-4">
              <Package size={20} />
              Order #{order.order_number}
            </div>
          )}
          
          <p className="text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Thank you for your purchase! We've received your order and are getting it ready for shipment. 
            A confirmation email has been sent to your inbox.
          </p>
        </div>

        {/* Order Details Card */}
        {order ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 overflow-hidden mb-8">
            {/* Timeline */}
            <div className="p-8 bg-slate-50/50 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">What Happens Next</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TimelineStep 
                  icon={CheckCircle} 
                  title="Order Confirmed" 
                  desc="Your order has been received"
                  active={true}
                />
                <TimelineStep 
                  icon={Package} 
                  title="Processing" 
                  desc="We're preparing your items"
                  active={order.status === 'on-processing' || order.status === 'on-delivery' || order.status === 'delivered'}
                />
                <TimelineStep 
                  icon={Truck} 
                  title="On the Way" 
                  desc="Estimated delivery in 5-7 days"
                  active={order.status === 'on-delivery' || order.status === 'delivered'}
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="p-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-4 bg-slate-50 rounded-2xl">
                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-200">
                      <img 
                        src={getImageUrl(item.product)} 
                        className="w-full h-full object-cover" 
                        alt={item.product?.name} 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{item.product?.name}</h4>
                      <p className="text-sm text-slate-500">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-bold text-slate-900">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <span className="font-black text-slate-900 uppercase">Total Paid</span>
                <span className="text-2xl font-black text-indigo-600">${order.total_amount}</span>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-6 bg-slate-50 rounded-2xl space-y-3">
                <div className="flex items-start gap-3">
                  <Truck className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-slate-900 mb-1">Shipping Address</p>
                    <p className="text-sm text-slate-600">{order.shipping_address}</p>
                    <p className="text-sm text-slate-600">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <p className="font-bold text-slate-900 mb-1">Estimated Delivery</p>
                    <p className="text-sm text-slate-600">
                      {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-12 text-center mb-8">
            <Package className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium">Order details not found. Check your email for confirmation.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/account" 
            state={{ tab: 'orders' }}
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-200"
          >
            <Package size={20} /> Track Your Order
          </Link>
          
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition"
          >
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>

        {/* Support Notice */}
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl text-center border border-slate-100">
          <div className="flex items-center justify-center gap-2 text-slate-600 mb-2">
            <Mail size={18} />
            <p className="font-bold">Need Help?</p>
          </div>
          <p className="text-sm text-slate-500">
            Questions about your order? Contact us at <span className="font-bold text-indigo-600">support@oveena.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ icon: Icon, title, desc, active }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'bg-slate-100 text-slate-400'
      }`}>
        <Icon size={20} />
      </div>
      <h4 className={`font-bold text-sm mb-1 ${active ? 'text-slate-900' : 'text-slate-400'}`}>
        {title}
      </h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}