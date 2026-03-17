import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from './components/AdminLayout';
import ShopLayout from './components/layout/ShopLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Shop Pages
import Home from './pages/shop/Home';
import ProductDetail from './pages/shop/ProductDetail'; 
import CartPage from './pages/shop/CartPage';
import Checkout from './pages/shop/Checkout';
import OrderSuccess from './pages/shop/OrderSuccess';
import AccountCenter from './pages/shop/AccountCenter';

// Auth Pages
import Register from './pages/Register';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrder from './pages/admin/ManageOrder';
import ManageUser from './pages/admin/ManageUser';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Routes>
      {/* --- PUBLIC CUSTOMER ROUTES --- */}
      <Route element={<ShopLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} /> 
        <Route path="/cart" element={<CartPage />} />
        
        {/* --- CUSTOMER PRIVATE ROUTES (Any logged-in user) --- */}
        <Route element={<ProtectedRoute adminOnly={false} />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/account" element={<AccountCenter />} />
        </Route>
      </Route>

      {/* --- AUTH ROUTES --- */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* --- ADMIN ONLY ROUTES --- */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/orders" element={<ManageOrder />} />
          <Route path="/admin/users" element={<ManageUser />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;