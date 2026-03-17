import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            alert("Registration failed. Please check your data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100 border border-slate-100">
                        <h2 className="text-4xl font-black text-slate-900 mb-2">Join Us.</h2>
                        <p className="text-slate-500 mb-8 font-medium">Create an account to start shopping.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                        placeholder="John Doe"
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="email" 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                        placeholder="email@example.com"
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="password" 
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                        placeholder="••••••••"
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Get Started <UserPlus size={20} /></>}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 font-medium">
                                Already a member? <Link to="/login" className="text-indigo-600 font-black hover:underline underline-offset-4">Log In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}