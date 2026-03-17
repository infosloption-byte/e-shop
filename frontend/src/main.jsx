import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Providers
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);