import { useRef } from 'react';
import { Upload, X, Trash2, CheckCircle2 } from 'lucide-react';

export default function ImageUploadZone({ 
  images, 
  setImages, 
  onDeleteExisting, 
  defaultImage, 
  setDefaultImage 
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false
    }));
    
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    
    // If no default is set, set the first uploaded one as default
    if (!defaultImage && updatedImages.length > 0) {
      handleSelectDefault(updatedImages[0]);
    }
  };

  const handleSelectDefault = (img) => {
    // For existing images, we store the server path
    // For new files, we store the name to match it on the backend or identify it locally
    const path = img.isExisting ? img.image_path : img.file.name;
    setDefaultImage(path);
  };

  const removeImage = (e, index, img) => {
    e.stopPropagation(); // Prevent setting as default when deleting
    
    if (img.isExisting) {
      if (window.confirm("Delete this image permanently from the gallery?")) {
        onDeleteExisting(img.id);
      }
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
      // Reset default if the deleted image was the default
      if (defaultImage === img.file.name) setDefaultImage('');
    }
  };

  return (
    <div className="space-y-6">
      <div 
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
      >
        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4 group-hover:scale-110 transition">
          <Upload size={32} />
        </div>
        <p className="font-bold text-slate-700">Add Product Images</p>
        <p className="text-xs text-slate-400 mt-1">Click to browse or drag and drop</p>
        <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => {
            const isDefault = img.isExisting 
              ? defaultImage === img.image_path 
              : defaultImage === img.file.name;

            return (
              <div 
                key={index} 
                onClick={() => handleSelectDefault(img)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group ${
                  isDefault ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="preview" />
                
                {/* Selection Indicator */}
                {isDefault && (
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg z-10">
                    <CheckCircle2 size={14} />
                  </div>
                )}

                {/* Overlay for non-selected */}
                {!isDefault && (
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                )}
                
                <button 
                  type="button"
                  onClick={(e) => removeImage(e, index, img)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-600 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-rose-600 hover:text-white"
                >
                  <Trash2 size={14} />
                </button>

                <div className="absolute bottom-2 left-2 flex gap-1">
                  {img.isExisting && (
                    <span className="bg-slate-800/80 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded-md font-bold uppercase">Saved</span>
                  )}
                  {isDefault && (
                    <span className="bg-indigo-600 text-[8px] text-white px-2 py-0.5 rounded-md font-bold uppercase">Main</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-[11px] text-slate-400 italic"> Tip: Click an image to set it as the primary display photo for the shop.</p>
    </div>
  );
}