import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="relative mx-auto w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center animate-pulse">
          <ShieldAlert size={48} className="text-rose-600" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Access Denied</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Oops! It looks like you don't have the administrative privileges required to view this section.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Home size={18} /> Back to Shop
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">
            <ArrowLeft size={18} /> Re-login as Admin
          </Link>
        </div>
      </div>
    </div>
  );
}