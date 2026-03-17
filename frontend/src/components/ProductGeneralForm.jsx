import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ProductGeneralForm({ formData, setFormData }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to load categories", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                    placeholder="Enter product title..."
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select 
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none">
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Price ($)</label>
            <input 
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" 
                placeholder="0.00"
            />
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Stock Quantity</label>
            <input 
                type="number" 
                value={formData.stock || ''}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                placeholder="0" 
            />
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea 
                rows="4" 
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                placeholder="Describe the product..."
            ></textarea>
            </div>
        </div>
    );
}