import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, LogOut, LayoutDashboard, ChevronDown, Package, UserCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../../context/CartDrawer';

export default function Navbar() {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();
  const menuRef = useRef();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-8">
            
            <Link to="/" className="text-2xl font-black text-slate-900 tracking-tighter shrink-0">
              OVEENA<span className="text-indigo-600">.</span>
            </Link>

            {/* Centered Search */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="group relative p-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all duration-300 ml-2 shadow-lg shadow-slate-200"
              >
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-3 pl-4 border-l border-slate-100 hover:opacity-80 transition-all"
                  >
                    <div className="hidden lg:block text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Account</p>
                      <p className="text-sm font-bold text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-slate-200">
                      {user.name[0]}
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200 py-2 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-slate-50 mb-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      {/* Redirects to Account Center with 'profile' tab active */}
                      <Link 
                        to="/account" 
                        state={{ tab: 'profile' }}
                        onClick={() => setIsMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <UserCircle size={18} /> My Profile
                      </Link>
                      
                      {/* Redirects to Account Center with 'orders' tab active */}
                      <Link 
                        to="/account" 
                        state={{ tab: 'orders' }}
                        onClick={() => setIsMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <Package size={18} /> Order History
                      </Link>

                      {/* Redirects to Account Center with 'security' tab active */}
                      <Link 
                        to="/account" 
                        state={{ tab: 'security' }}
                        onClick={() => setIsMenuOpen(false)} 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <ShieldCheck size={18} /> Security
                      </Link>

                      {user.is_admin && (
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 mt-1 text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition border-y border-indigo-100/50">
                          <LayoutDashboard size={18} /> Admin Dashboard
                        </Link>
                      )}

                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 mt-2 text-sm font-bold text-red-500 hover:bg-red-50 transition border-t border-slate-50"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 p-3 hover:bg-slate-50 rounded-2xl text-slate-600 transition-all">
                  <User size={20} className="text-slate-400" />
                  <span className="text-sm font-bold">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}