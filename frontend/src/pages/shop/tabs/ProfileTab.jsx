import { useState } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle2, Edit2, Save, X, Loader2 } from 'lucide-react';
import api from '../../../api/axios';
import { useToast } from '../../../context/ToastContext';

export default function ProfileTab({ user: initialUser }) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialUser);
  
  const [formData, setFormData] = useState({
    name: initialUser.name,
    phone_number: initialUser.phone_number || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put('/user/profile', formData);
      
      // Update local state
      setUser(response.data.user);
      
      // Update localStorage so navbar shows new name
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone_number: user.phone_number || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cover Photo */}
      <div className="h-40 bg-gradient-to-br from-indigo-600 to-indigo-800 relative">
        <div className="absolute -bottom-12 left-12 w-28 h-28 bg-indigo-600 rounded-[2rem] border-8 border-white flex items-center justify-center text-white text-4xl font-black shadow-lg">
          {user.name[0].toUpperCase()}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-12 pt-20">
        {/* Edit Toggle */}
        <div className="flex justify-end mb-8">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition shadow-lg shadow-slate-200"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <InfoField 
            label="Full Name" 
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            icon={User}
            isEditing={isEditing}
          />
          
          <InfoField 
            label="Email Address" 
            value={user.email}
            icon={Mail}
            isEditing={false}
            disabled
            hint="Email cannot be changed"
          />
          
          <InfoField 
            label="Primary Phone" 
            value={formData.phone_number}
            onChange={(value) => setFormData(prev => ({ ...prev, phone_number: value }))}
            icon={Phone}
            isEditing={isEditing}
            placeholder="Enter phone number"
          />
          
          <InfoField 
            label="Member Since" 
            value={new Date(user.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            icon={MapPin}
            isEditing={false}
            disabled
          />
        </div>

        {/* Account Status */}
        <div className="space-y-4">
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
            <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
            <div>
              <p className="text-emerald-900 font-bold text-sm">Email Verified</p>
              <p className="text-emerald-700/70 text-xs">Your email address has been confirmed</p>
            </div>
          </div>

          {user.phone_verified_at ? (
            <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
              <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
              <div>
                <p className="text-emerald-900 font-bold text-sm">Phone Verified</p>
                <p className="text-emerald-700/70 text-xs">Your phone number has been confirmed</p>
              </div>
            </div>
          ) : user.phone_number && (
            <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-4">
              <Phone className="text-amber-500 shrink-0" size={24} />
              <div className="flex-1">
                <p className="text-amber-900 font-bold text-sm">Phone Not Verified</p>
                <p className="text-amber-700/70 text-xs">Verify your phone number for account security</p>
              </div>
              <button className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600 transition">
                Verify Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, onChange, icon: Icon, isEditing, disabled, hint, placeholder }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </label>
        {disabled && hint && (
          <span className="text-[9px] text-slate-400 italic">{hint}</span>
        )}
      </div>
      
      {isEditing && !disabled ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 bg-white border-2 border-indigo-200 rounded-2xl outline-none focus:border-indigo-500 transition font-bold text-slate-700"
        />
      ) : (
        <div className={`flex items-center justify-between p-4 rounded-2xl border ${
          disabled ? 'bg-slate-50/50 border-slate-100' : 'bg-slate-50 border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <Icon size={18} className="text-indigo-600" />
            <span className="font-bold text-slate-700 text-sm">
              {value || <span className="text-slate-400 italic">Not provided</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}