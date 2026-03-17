import AdminLayout from '../../components/AdminLayout';
import { Save, Key, CreditCard } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-slate-800">Admin Settings</h2>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
            <Key className="text-indigo-600" size={20} /> AI Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gemini API Key</label>
              <input type="password" placeholder="••••••••••••" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
              <Save size={18} /> Save Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}