import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { 
  LayoutDashboard, 
  Box, 
  ClipboardList, 
  Users, 
  Settings,
  Search,
  Bell,
  LogOut
} from 'lucide-react';
import api from '../api/axios';

const adminMenus = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Box, label: 'Products', path: '/admin/products' },
  { icon: ClipboardList, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showToast("Logged out successfully", "info");
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tighter uppercase">DashStack</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {adminMenus.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.label} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10" 
            />
          </div>
          
          <div className="flex items-center gap-4">
             <Bell className="text-slate-400 cursor-pointer hover:text-indigo-600 transition" size={20} />
             <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs shadow-sm">
               AD
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 group"
               title="Logout"
             >
               <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
               <span className="text-sm font-bold">Logout</span>
             </button>
          </div>
        </header>

        <main className="p-8">
          {/* Outlet renders the child routes defined in main.jsx */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}