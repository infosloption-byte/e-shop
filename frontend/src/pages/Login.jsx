import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/login', formData);
            
            // Sync with your ProtectedRoute keys
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            if (res.data.user.is_admin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100 border border-slate-100 relative overflow-hidden">
                        {/* Decorative Background Blob */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                        
                        <div className="relative">
                            <h2 className="text-4xl font-black text-slate-900 mb-2">Welcome Back.</h2>
                            <p className="text-slate-500 mb-10 font-medium">Enter your details to access your account.</p>
                            
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-shake">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                            placeholder="hello@example.com"
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="password" 
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                            placeholder="••••••••"
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 group"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                            </form>

                            <div className="mt-10 text-center">
                                <p className="text-slate-500 font-medium">
                                    New to Lumina? <Link to="/register" className="text-indigo-600 font-black hover:underline underline-offset-4">Create Account</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}