import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, onOpenCart }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Restored ShopSphere Logo & Name */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl">🛍️</span>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            ShopSphere
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <Link to="/" className="hover:text-[#8b9dc3] transition">Shop</Link>
          <Link to="/about" className="hover:text-[#8b9dc3] transition">About & Contact</Link>

          {/* Conditional Role Dashboard Links */}
          {user?.role === 'seller' && (
            <Link to="/seller/dashboard" className="text-[#8b9dc3] font-bold hover:underline transition">
              Vendor Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-purple-600 font-bold hover:underline transition">
              Admin Portal
            </Link>
          )}
          {token && (
            <Link to="/my-orders" className="hover:text-[#8b9dc3] transition">My Orders</Link>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-[#8b9dc3] transition"
            aria-label="View Cart"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8b9dc3] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {token ? (
            <button
              onClick={handleLogout}
              className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-200 transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#8b9dc3] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#7a8cb2] transition uppercase tracking-wider"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;