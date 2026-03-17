import { Lock, ShieldCheck, Phone, ChevronRight } from 'lucide-react';

export default function SecurityTab() {
  return (
    <div className="p-10 animate-in fade-in duration-500 space-y-8">
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Security Settings</h3>
        <p className="text-slate-500 text-sm">Update your password and secure your account.</p>
      </div>

      <div className="space-y-6">
        <SecurityAction title="Reset Password" desc="Change your secret key regularly" icon={Lock} />
        <SecurityAction title="Two-Factor Auth" desc="Add an extra layer of protection" icon={ShieldCheck} badge="Recommended" />
        <SecurityAction title="Verified Devices" desc="Review where you are logged in" icon={Phone} />
      </div>

      <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between">
        <div>
          <h4 className="font-bold mb-1">Delete Account</h4>
          <p className="text-slate-400 text-xs">Once deleted, all data is gone forever.</p>
        </div>
        <button className="px-6 py-3 bg-red-500/10 hover:bg-red-50 text-red-500 hover:text-white rounded-xl font-bold text-sm transition-all border border-red-500/20">
          Delete
        </button>
      </div>
    </div>
  );
}

function SecurityAction({ title, desc, icon: Icon, badge }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-100 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
          <Icon size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-900">{title}</p>
            {badge && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[8px] font-black uppercase rounded-md">{badge}</span>}
          </div>
          <p className="text-xs text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
    </div>
  );
}