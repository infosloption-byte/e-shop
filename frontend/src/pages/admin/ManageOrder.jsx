import { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, Eye, Calendar, 
  Package, Truck, CheckCircle, RefreshCcw, 
  X, Phone, Mail, MapPin, Loader2
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';

export default function ManageOrder() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    order_number: '',
    status: 'all',
    start_date: '',
    end_date: ''
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.order_number) params.append('order_number', filters.order_number);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await api.get(`/orders?${params.toString()}`);
      setOrders(response.data);
    } catch (err) {
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      showToast("Order status updated", "success");
      
      // Update local state with the refreshed order data (including new timestamps)
      const updatedOrder = response.data.order;
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      setSelectedOrder(updatedOrder);
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'on-processing': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'on-delivery': 'bg-blue-100 text-blue-700 border-blue-200',
      'delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'returned': 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const formatTimelineDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
          <p className="text-sm text-slate-500">Track and fulfill customer purchases</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setFilters({ order_number: '', status: 'all', start_date: '', end_date: '' })}
             className="p-2 text-slate-400 hover:text-indigo-600 transition"
             title="Reset Filters"
           >
             <RefreshCcw size={20} />
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Order ID..."
            value={filters.order_number}
            onChange={(e) => setFilters({...filters, order_number: e.target.value})}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
        
        <select 
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10"
        >
          <option value="all">All Statuses</option>
          <option value="on-processing">On-Processing</option>
          <option value="on-delivery">On-Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="returned">Returned</option>
        </select>

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <input 
            type="date" 
            value={filters.start_date}
            onChange={(e) => setFilters({...filters, start_date: e.target.value})}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm flex-1 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">to</span>
          <input 
            type="date" 
            value={filters.end_date}
            onChange={(e) => setFilters({...filters, end_date: e.target.value})}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm flex-1 outline-none"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Order Details</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Customer</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Total</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
               <tr><td colSpan="5" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
            ) : orders.length === 0 ? (
               <tr><td colSpan="5" className="p-20 text-center text-slate-400 font-medium">No orders found.</td></tr>
            ) : orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <div className="font-bold text-slate-800">#{order.order_number}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{new Date(order.created_at).toLocaleDateString()}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-bold text-slate-700">{order.user?.name}</div>
                  <div className="text-xs text-slate-400">{order.phone}</div>
                </td>
                <td className="p-4 font-bold text-slate-700">${order.total_amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.status)}`}>
                    {order.status?.replace('-', ' ')}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Order Details</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">#{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition"><X size={20}/></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Customer</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-600"><Mail size={16} /> {selectedOrder.user?.email}</div>
                  <div className="flex items-center gap-3 text-sm text-slate-600"><Phone size={16} /> {selectedOrder.phone}</div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Shipping Address</h4>
                  <div className="flex items-start gap-3 text-sm text-slate-600"><MapPin size={16} className="mt-1" /> {selectedOrder.shipping_address}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Items</h4>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-3 text-slate-500">Product</th>
                        <th className="p-3 text-slate-500 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="p-3 font-medium text-slate-700">{item.product?.name} <span className="text-slate-400 ml-1">x{item.quantity}</span></td>
                          <td className="p-3 text-right font-bold text-slate-700">${item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/50">
                      <tr>
                        <td className="p-3 font-bold text-slate-800">Total Paid</td>
                        <td className="p-3 text-right font-black text-indigo-600 text-lg">${selectedOrder.total_amount}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* JOURNEY TIMELINE SECTION */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Journey</h4>
                
                <div className="relative space-y-6 left-1">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200"></div>

                  {[
                    { key: 'on-processing', label: 'Order Processed', date: selectedOrder.processed_at || selectedOrder.created_at, icon: Package },
                    { key: 'on-delivery', label: 'Out for Delivery', date: selectedOrder.shipped_at, icon: Truck },
                    { key: 'delivered', label: 'Delivered', date: selectedOrder.delivered_at, icon: CheckCircle },
                    { key: 'returned', label: 'Returned', date: selectedOrder.returned_at, icon: RefreshCcw },
                  ].map((step) => {
                    const isCompleted = !!step.date;
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-300'
                        }`}>
                          <Icon size={12} />
                        </div>

                        <div className="flex-1 -mt-1">
                          <div className="flex justify-between items-center">
                            <p className={`text-sm font-bold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                              {step.label}
                            </p>
                            {isCompleted ? (
                              <span className="text-[10px] font-medium text-slate-400 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-100">
                                {formatTimelineDate(step.date)}
                              </span>
                            ) : (
                              <button
                                disabled={updatingStatus}
                                onClick={() => handleUpdateStatus(selectedOrder.id, step.key)}
                                className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 transition underline decoration-2 underline-offset-4"
                              >
                                Mark as {step.key.replace('-', ' ')}
                              </button>
                            )}
                          </div>
                          {!isCompleted && <p className="text-[10px] text-slate-300 mt-0.5 font-medium uppercase">Pending</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* END TIMELINE */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}