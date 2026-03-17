import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  
  const [formData, setFormData] = useState({ password: '', password_confirmation: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reset-password', { token, email, ...formData });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200/50">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Set New Password</h2>
        <p className="text-slate-500 mb-8 text-sm italic">Ensure your account is secure with a strong password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="New Password"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Confirm Password"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 transition"
            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
          />
          <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition duration-300">
            UPDATE PASSWORD
          </button>
        </form>

        {status === 'success' && <p className="mt-4 text-emerald-500 font-bold text-center">Password updated! You can now log in.</p>}
      </div>
    </div>
  );
}