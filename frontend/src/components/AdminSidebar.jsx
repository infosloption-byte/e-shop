import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ListTree, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react'; // Assuming you use lucide-react for icons

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const location = useLocation();

  const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-slate-900 h-screen sticky top-0 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-indigo-400">Admin Panel</h1>
        <p className="text-xs text-slate-400">Store Management v1.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition ${
                isActive 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="flex items-center space-x-3 w-full p-3 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}