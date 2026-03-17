import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowLeft, Star, Truck, RefreshCw, Minus, Plus, Loader2 } from 'lucide-react';
import { getImageUrl } from '../../utils/helpers';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  if (!product) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Link to="/" className="text-indigo-600 mt-4 block">Return to Shop</Link>
    </div>
  );

  /** * LOGIC FIX: 
   * Normalize the images. 
   * Gallery images use 'image_path' from ProductImage model.
   * Default image uses 'image_url' from Product model.
   */
  const galleryImages = product.images?.map(img => img.image_path) || [];
  const mainImage = product.image_url;
  
  // Combine them into a single list of strings, removing duplicates if main image is in gallery
  const allImagePaths = Array.from(new Set([mainImage, ...galleryImages])).filter(Boolean);
  
  // If no images at all, use placeholder
  const displayImages = allImagePaths.length > 0 ? allImagePaths : [null];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-slate-400 hover:text-indigo-600 mb-8 transition gap-2 text-sm font-medium">
        <ArrowLeft size={16} /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Left: Image Gallery */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
            <img 
              src={getImageUrl(product)} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-500" 
            />
          </div>
          
          {displayImages.length > 1 && (
            <div className="grid grid-cols-5 gap-4">
              {displayImages.map((path, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(index)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === index ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl(path)} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Essential Info */}
        <div className="flex flex-col justify-start">
          <div className="mb-6">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 inline-block">
              {product.category?.name || 'Essentials'}
            </span>
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-black text-indigo-600">${Number(product.price).toFixed(2)}</p>
              <div className="h-6 w-[1px] bg-slate-200"></div>
              <div className="flex items-center text-amber-400 gap-1">
                <Star size={16} fill="currentColor" />
                <span className="text-slate-900 text-sm font-bold">4.8</span>
                <span className="text-slate-400 text-xs font-medium ml-1">(Stock: {product.stock})</span>
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 hover:bg-white rounded-xl transition text-slate-600"><Minus size={18} /></button>
                <span className="w-12 text-center font-bold text-slate-800">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-3 hover:bg-white rounded-xl transition text-slate-600"><Plus size={18} /></button>
              </div>
              <button 
                onClick={() => { for(let i=0; i<quantity; i++) addToCart(product); }} 
                disabled={product.stock <= 0}
                className="flex-1 bg-indigo-600 text-white py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none"
              >
                <ShoppingBag size={20} /> 
                {product.stock > 0 ? `Add to Bag — $${(product.price * quantity).toFixed(2)}` : 'Out of Stock'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 font-medium">
                <Truck size={20} className="text-indigo-500" /> Free Shipping over $100
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 font-medium">
                <RefreshCw size={20} className="text-indigo-500" /> 30-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separate Description Section */}
      <div className="border-t border-slate-100 pt-16">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">Product Story</h3>
          <div className="text-slate-600 text-lg leading-relaxed space-y-4">
            {product.description ? (
              product.description.split('\n').map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p className="italic">No description available for this product.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}