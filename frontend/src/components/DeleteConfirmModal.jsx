import { AlertTriangle, Trash2, X } from 'lucide-react';
import Button from './Button';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800">{title || "Confirm Delete"}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {message || "Are you sure you want to delete this item? This action cannot be undone."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 flex gap-3">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button 
            variant="danger"
            onClick={onConfirm} 
            isLoading={isLoading} 
            icon={Trash2}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}