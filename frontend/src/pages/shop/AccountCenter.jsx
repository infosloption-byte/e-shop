import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Package, Lock, Printer, X } from 'lucide-react';
import ProfileTab from './tabs/ProfileTab';
import OrderHistoryTab from './tabs/OrderHistoryTab';
import SecurityTab from './tabs/SecurityTab';
import OrderDetailsView from './modals/OrderDetailsView';
import ReceiptView from './modals/ReceiptView';

export default function AccountCenter() {
  const [activeTab, setActiveTab] = useState('profile');
  const location = useLocation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handlePrint = () => window.print();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 font-sans print:p-0">
      <div className="flex flex-col lg:flex-row gap-12 print:hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Settings</h1>
            <p className="text-slate-500 text-sm font-medium">Manage your account</p>
          </div>
          <nav className="space-y-2">
            <TabBtn id="profile" label="My Profile" icon={User} active={activeTab} onClick={setActiveTab} />
            <TabBtn id="orders" label="Order History" icon={Package} active={activeTab} onClick={setActiveTab} />
            <TabBtn id="security" label="Security" icon={Lock} active={activeTab} onClick={setActiveTab} />
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-100 min-h-[600px] overflow-hidden">
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'orders' && (
            <OrderHistoryTab 
              onViewDetails={(order) => { setSelectedOrder(order); setShowReceipt(false); }}
              onViewReceipt={(order) => { setSelectedOrder(order); setShowReceipt(true); }}
            />
          )}
          {activeTab === 'security' && <SecurityTab />}
        </main>
      </div>

      {/* Popups */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 print:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl print:shadow-none print:max-h-none print:rounded-none">
            <div className="sticky top-0 bg-white/90 backdrop-blur px-8 py-6 border-b border-slate-100 flex justify-between items-center print:hidden">
              <h4 className="font-black text-slate-900 uppercase tracking-tighter">
                {showReceipt ? 'Payment Receipt' : 'Order Information'}
              </h4>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition"><Printer size={18} /></button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition"><X size={18} /></button>
              </div>
            </div>
            <div className="p-8 md:p-12">
              {showReceipt ? <ReceiptView order={selectedOrder} user={user} /> : <OrderDetailsView order={selectedOrder} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ id, label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
        active === id 
        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2' 
        : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}