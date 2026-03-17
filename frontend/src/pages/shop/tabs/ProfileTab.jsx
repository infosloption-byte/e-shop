import { User, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function ProfileTab({ user }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="h-40 bg-slate-900 relative">
        <div className="absolute -bottom-12 left-12 w-28 h-28 bg-indigo-600 rounded-[2rem] border-8 border-white flex items-center justify-center text-white text-4xl font-black shadow-lg">
          {user.name[0]}
        </div>
      </div>
      <div className="p-12 pt-20 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoItem label="Full Name" value={user.name} icon={User} />
          <InfoItem label="Email Address" value={user.email} icon={Mail} />
          <InfoItem label="Primary Phone" value={user.phone || 'Not provided'} icon={Phone} />
          <InfoItem label="Default Address" value={user.address || 'Not provided'} icon={MapPin} />
        </div>
        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
          <CheckCircle2 className="text-emerald-500" size={24} />
          <div>
            <p className="text-emerald-900 font-bold text-sm">Account Verified</p>
            <p className="text-emerald-700/70 text-xs">You have full access to all premium features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon, isVerified, onVerify }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        {value && !isVerified && (
          <button onClick={onVerify} className="text-[10px] font-black text-red-500 uppercase hover:underline">
            Verify Now
          </button>
        )}
      </div>
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3">
          <Icon size={18} className={isVerified ? "text-emerald-500" : "text-indigo-600"} />
          <span className="font-bold text-slate-700 text-sm">{value || 'Not provided'}</span>
        </div>
        {isVerified && <Check className="text-emerald-500" size={16} />}
      </div>
    </div>
  );
}