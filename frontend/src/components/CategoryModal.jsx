import { useState, useRef, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';
import Button from './Button'; // Import our new reusable button

export default function CategoryModal({ isOpen, onClose, onSave, isLoading, initialData = null }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Sync state if initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPreview(initialData.image_url || null);
    } else {
      setName('');
      setImage(null);
      setPreview(null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return; // Basic validation
    
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? 'Update Category' : 'New Category'}
          </h3>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition disabled:opacity-50"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Category Image Upload */}
          <div 
            onClick={() => !isLoading && fileInputRef.current.click()}
            className={`relative w-32 h-32 mx-auto border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group overflow-hidden ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" alt="Category" />
            ) : (
              <div className="text-center">
                <Upload size={24} className="mx-auto text-slate-300 group-hover:text-indigo-600" />
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 block">Icon</span>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Category Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60" 
              placeholder="e.g. Home Appliances"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex gap-3">
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            isLoading={isLoading} 
            icon={Save}
            className="flex-1"
          >
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}