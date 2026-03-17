import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function ShopLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Modernized Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-slate-900 tracking-tighter">OVEENA<span className="text-indigo-600">.</span></h4>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Crafting premium essentials for the modern lifestyle. Quality and elegance in every detail.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-widest">Support</h4>
              <ul className="text-sm text-slate-500 space-y-4 font-medium">
                <li><Link to="/help" className="hover:text-indigo-600 transition">Help Center</Link></li>
                <li><Link to="/delivery" className="hover:text-indigo-600 transition">Delivery Info</Link></li>
                <li><Link to="/returns" className="hover:text-indigo-600 transition">Returns Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-widest">Company</h4>
              <ul className="text-sm text-slate-500 space-y-4 font-medium">
                <li><Link to="/about" className="hover:text-indigo-600 transition">Our Story</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-600 transition">Contact Us</Link></li>
                <li><Link to="/terms" className="hover:text-indigo-600 transition">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-widest">Newsletter</h4>
              <p className="text-sm text-slate-500 mb-4">Join our list for exclusive drops.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Email" className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-600 w-full" />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm">Join</button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400 font-medium">© 2026 OVEENA INC. All rights reserved.</p>
            <div className="flex gap-6">
              {/* Add social icons here if needed */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}