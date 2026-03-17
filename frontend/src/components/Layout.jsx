import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const { cart } = useCart();
    
    // Get user from localStorage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 h-20 flex items-center justify-between sticky top-0 z-50">
                <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
                    OVEENA
                </Link>
                
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition">Shop</Link>
                    
                    {user?.is_admin && (
                        <Link to="/admin" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition">
                            <LayoutDashboard size={18} /> Admin
                        </Link>
                    )}

                    <Link to="/cart" className="relative text-slate-600 hover:text-indigo-600 transition">
                        <ShoppingCart size={22} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Welcome back</p>
                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100">
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}