import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => setToast(null), 3000);
  }, []);

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast UI Overlay */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] animate-in fade-in slide-in-from-right-5 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
            toast.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
            'bg-blue-50 border-blue-100 text-blue-800'
          }`}>
            {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-500" />}
            {toast.type === 'error' && <AlertCircle size={20} className="text-rose-500" />}
            {toast.type === 'info' && <Info size={20} className="text-blue-500" />}
            
            <p className="font-bold text-sm">{toast.message}</p>
            
            <button onClick={hideToast} className="ml-2 p-1 hover:bg-black/5 rounded-lg transition">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);