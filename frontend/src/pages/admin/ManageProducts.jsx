import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import ProductGeneralForm from '../../components/ProductGeneralForm';
import ImageUploadZone from '../../components/ImageUploadZone';
import CategoryModal from '../../components/CategoryModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import Button from '../../components/Button';
import { useToast } from '../../context/ToastContext';
import api, { BASE_URL } from '../../api/axios';

import { 
  Plus, Edit, Trash2, Package, Layers, 
  Image as ImageIcon, X, Save, Loader2 
} from 'lucide-react';

export default function ManageProducts() {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('general');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', description: '', category_id: '' });
  const [productImages, setProductImages] = useState([]);
  const [defaultImage, setDefaultImage] = useState(''); // NEW: Track the main image path
  
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      showToast("Failed to sync with server", "error");
    } finally {
      setIsInitialLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openProductModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentId(product.id);
      setFormData({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        category_id: product.category_id
      });
      
      setDefaultImage(product.image_url || ''); // Set existing default image

      const existingImages = product.images.map(img => ({
        id: img.id,
        image_path: img.image_path, // Keep reference to server path
        url: img.image_path.startsWith('http') ? img.image_path : `${BASE_URL}/storage/${img.image_path}`,
        isExisting: true
      }));
      setProductImages(existingImages);
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({ name: '', price: '', stock: '', description: '', category_id: '' });
      setProductImages([]);
      setDefaultImage('');
    }
    setModalTab('general');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async () => {
    setIsActionLoading(true);
    const data = new FormData();
    
    // Append text fields
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    // Append the selected default image path/name
    data.append('image_url', defaultImage);
    
    // Append new files
    productImages.forEach(img => {
      if (img.file) {
        data.append('images[]', img.file);
      }
    });

    if (isEditing) {
      data.append('_method', 'PUT'); // Laravel method spoofing
    }

    const url = isEditing ? `/products/${currentId}` : '/products';

    try {
      await api.post(url, data); 
      showToast(isEditing ? "Product updated!" : "Product created!", "success");
      setIsProductModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Please check all fields", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await api.delete(`/product-images/${imageId}`);
      setProductImages(prev => prev.filter(img => img.id !== imageId));
      showToast("Image removed", "success");
    } catch (err) {
      showToast("Failed to delete image", "error");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Inventory</h2>
            <p className="text-sm text-slate-500">Managing {products.length} products</p>
          </div>
          <Button onClick={() => openProductModal()} icon={Plus}>Add Product</Button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Product</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                        {product.image_url ? (
                          <img 
                            src={`${BASE_URL}/storage/${product.image_url}`} 
                            className="w-full h-full object-cover" 
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20}/></div>
                        )}
                      </div>
                      <span className="font-bold text-slate-700">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-5 font-black text-slate-900">${product.price}</td>
                  <td className="p-5">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {product.stock} in units
                     </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openProductModal(product)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"><Edit size={18}/></button>
                      <button onClick={() => { setItemToDelete({id: product.id, type: 'product'}); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800">{isEditing ? 'Update Product' : 'Create Product'}</h3>
                <p className="text-sm text-slate-500">Enter the essential details for your item</p>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition"><X size={24}/></button>
            </div>

            <div className="flex bg-slate-50/50 border-b border-slate-100 px-8">
              <TabBtn active={modalTab === 'general'} onClick={() => setModalTab('general')} label="Basic Info" />
              <TabBtn active={modalTab === 'images'} onClick={() => setModalTab('images')} label="Gallery & Main Image" />
            </div>

            <div className="p-8 overflow-y-auto">
              {modalTab === 'general' ? (
                <ProductGeneralForm formData={formData} setFormData={setFormData} />
              ) : (
                <ImageUploadZone 
                  images={productImages} 
                  setImages={setProductImages} 
                  onDeleteExisting={handleDeleteImage}
                  defaultImage={defaultImage}
                  setDefaultImage={setDefaultImage}
                />
              )}
            </div>

            <div className="p-8 border-t border-slate-50 flex justify-end gap-4">
              <Button variant="secondary" onClick={() => setIsProductModalOpen(false)}>Discard</Button>
              <Button onClick={handleSaveProduct} isLoading={isActionLoading} icon={Save}>
                {isEditing ? 'Save Changes' : 'Publish Product'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={async () => {
          await api.delete(`/products/${itemToDelete.id}`);
          fetchData();
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
}

function TabBtn({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`py-4 px-6 text-sm font-black transition-all border-b-2 uppercase tracking-widest ${
        active ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}
    </button>
  );
}