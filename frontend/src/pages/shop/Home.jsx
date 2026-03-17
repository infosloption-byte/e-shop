import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowRight, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/helpers';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        // Show the latest 8 products on the home page
        setProducts(res.data.slice(0, 8));
      } catch (err) {
        console.error("Could not fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Banner */}
      <section className="relative bg-slate-900 h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-gradient-to-r from-indigo-600 to-transparent"></div>
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4 block">
              Spring / Summer 2026
            </span>
            <h1 className="text-7xl font-black text-white mb-6 leading-[1.1]">
              The Modern <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">
                Essential.
              </span>
            </h1>
            <p className="text-slate-400 text-lg mb-8 max-w-lg leading-relaxed">
              Discover a curated collection of premium essentials designed for the modern lifestyle. Quality meets minimalist aesthetic.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all hover:gap-4 group">
                Shop Collection 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-black text-slate-800 mb-12">Featured Products</h2>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product.id} className="group bg-white rounded-3xl p-4 border border-slate-100 hover:shadow-2xl transition-all duration-500">
                <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-5 relative">
                  <Link to={`/product/${product.id}`}>
                    <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  </Link>
                  <button onClick={() => addToCart(product)} className="absolute bottom-4 right-4 bg-white p-3.5 rounded-2xl shadow-xl text-indigo-600 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white">
                    <ShoppingCart size={22} />
                  </button>
                </div>
                <div className="px-2">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-slate-800 truncate text-lg hover:text-indigo-600 transition">{product.name}</h3>
                  </Link>
                  <p className="text-indigo-600 font-black text-xl mt-2">${Number(product.price).toFixed(2)}</p>
                </div> 
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}