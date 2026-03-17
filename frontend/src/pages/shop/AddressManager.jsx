import { useState, useEffect } from 'react';
import { MapPin, Plus, Check } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const { addAddress, loading } = useProfile();

  // Logic to handle adding a new address
  const handleAddNew = async () => {
    // This would typically open a modal/form; here is a simplified example
    const mockAddress = {
      address_line: "444B, Bopagoda",
      city: "Rathgama",
      postal_code: "80250",
      is_default: true
    };
    await addAddress(mockAddress);
    // Refresh address list after adding
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-black text-slate-900 uppercase">Saved Addresses</h4>
        <button 
          onClick={handleAddNew}
          className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="grid gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className={`p-4 rounded-2xl border ${addr.is_default ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100'}`}>
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <MapPin className={addr.is_default ? 'text-indigo-600' : 'text-slate-400'} size={18} />
                <div>
                  <p className="text-sm font-bold text-slate-900">{addr.address_line}</p>
                  <p className="text-xs text-slate-500">{addr.city}, {addr.postal_code}</p>
                </div>
              </div>
              {addr.is_default && (
                <span className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase">
                  <Check size={12} /> Default
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}