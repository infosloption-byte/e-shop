import { useState, useEffect } from 'react';
import { Search, Package, Eye, Receipt } from 'lucide-react';
import api from '../../../api/axios';

export default function OrderHistoryTab({ onViewDetails, onViewReceipt }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', search: '', date: '' });

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let result = orders;
    if (filters.status !== 'all') result = result.filter(o => o.status === filters.status);
    if (filters.search) result = result.filter(o => o.order_number.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.date) result = result.filter(o => o.created_at.startsWith(filters.date));
    setFilteredOrders(result);
  }, [filters, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/orders');
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order History</h3>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" placeholder="Order #" className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none" onChange={(e) => setFilters({...filters, search: e.target.value})} />
          </div>
          <select className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold outline-none" onChange={(e) => setFilters({...filters, status: e.target.value})}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-slate-400 font-bold tracking-widest text-xs uppercase">Syncing...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
          <Package className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="bg-white group">
                  <td className="py-4 pl-6 border-y border-l border-slate-50 rounded-l-3xl">
                    <p className="text-xs font-black text-slate-900">{order.order_number}</p>
                    <p className="text-sm font-bold text-indigo-600">${order.total_amount}</p>
                  </td>
                  <td className="py-4 border-y border-slate-50">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6 border-y border-r border-slate-50 rounded-r-3xl text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onViewDetails(order)} className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition"><Eye size={16} /></button>
                      <button onClick={() => onViewReceipt(order)} className="p-2 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition"><Receipt size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}