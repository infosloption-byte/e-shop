import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { 
  Users, Search, ShieldCheck, User as UserIcon, 
  Mail, Calendar, ShoppingBag, Loader2, MoreVertical
} from 'lucide-react';

export default function ManageUser() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      showToast(`User promoted to ${newRole}`, "success");
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed", "error");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500">Manage permissions and view customer activity</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">User Identity</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Role</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Orders</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Joined</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></td></tr>
            ) : filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/> {user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 w-fit ${
                    user.role === 'admin' 
                    ? 'bg-purple-50 text-purple-700 border-purple-100' 
                    : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {user.role === 'admin' ? <ShieldCheck size={12}/> : <UserIcon size={12}/>}
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    <ShoppingBag size={14} className="text-slate-400"/>
                    {user.orders_count || 0}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar size={12}/> {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleRole(user.id, user.role)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                  >
                    {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}