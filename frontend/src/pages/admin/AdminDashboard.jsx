import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, ShoppingBag, BarChart3, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, isUp, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        {loading ? (
          <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-lg mt-1"></div>
        ) : (
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        )}
      </div>
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
        <Icon size={24} />
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm">
      {isUp ? (
        <span className="flex items-center text-emerald-500 font-bold"><TrendingUp size={16} className="mr-1"/> {trend}</span>
      ) : (
        <span className="flex items-center text-rose-500 font-bold"><TrendingDown size={16} className="mr-1"/> {trend}</span>
      )}
      <span className="text-slate-400 font-medium">vs last month</span>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    total_users: 0, 
    total_orders: 0, 
    total_sales: 0,
    revenue_history: [] 
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30D'); // State for 30D or 6M

  // Fetch data whenever timeRange changes
  useEffect(() => {
    fetchStats();
    
    // Optional: Real-time refresh every 5 minutes
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Pass range as a query parameter to the backend
      const res = await api.get(`/admin/stats?range=${timeRange}`);
      setStats(res.data);
    } catch (err) {
      console.error("Could not fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Real-time store performance overview</p>
      </div>
      
      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Customers" 
          value={stats.total_users.toLocaleString()} 
          icon={Users} 
          trend="12%" 
          isUp={true} 
          loading={loading}
        />
        <StatCard 
          title="Total Orders" 
          value={stats.total_orders.toLocaleString()} 
          icon={ShoppingBag} 
          trend="5.4%" 
          isUp={true} 
          loading={loading}
        />
        <StatCard 
          title="Gross Revenue" 
          value={`$${Number(stats.total_sales).toLocaleString(undefined, {minimumFractionDigits: 2})}`} 
          icon={BarChart3} 
          trend="2.1%" 
          isUp={true} 
          loading={loading}
        />
      </div>

      {/* Sales Chart Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Revenue Analytics</h3>
            <p className="text-sm text-slate-400 font-medium">
              {timeRange === '30D' ? 'Daily' : 'Monthly'} revenue for the last {timeRange}
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="bg-slate-50 p-1 rounded-xl flex gap-1">
            <button 
              onClick={() => setTimeRange('30D')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === '30D' 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              30D
            </button>
            <button 
              onClick={() => setTimeRange('6M')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === '6M' 
                ? 'bg-white shadow-sm text-indigo-600' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              6M
            </button>
          </div>
        </div>

        <div className="h-80 w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl animate-pulse">
               <Loader2 className="animate-spin text-slate-200" size={40} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenue_history}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 10}} 
                  interval={timeRange === '30D' ? 4 : 0} // Show every 5th label on 30D to avoid crowding
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 500}} 
                  tickFormatter={(val) => `LKR ${val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`LKR ${value.toFixed(2)}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4F46E5' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}