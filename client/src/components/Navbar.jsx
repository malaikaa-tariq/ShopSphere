import React from 'react';

const Navbar = ({ cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
            style={{ backgroundColor: '#889FD1' }}
          >
            <svg className="w-7 h-7" viewBox="0 0 100 100" fill="currentColor">
              <path d="M32 30 C 32 12, 68 12, 68 30" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
              <path d="M20 30 L80 30 C86 30 90 35 88 42 L82 86 C81 92 76 96 70 96 L30 96 C24 96 19 92 18 86 L12 42 C10 35 14 30 20 30 Z" />
              <circle cx="37" cy="50" r="4.5" fill="#ffffff" />
              <path d="M58 50 Q 64 44 70 50" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <path d="M35 62 Q 50 78 65 62" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Shop<span style={{ color: '#889FD1' }}>Sphere</span>
          </span>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-colors">Home</a>
          <a href="#featured" className="hover:text-slate-900 transition-colors">Products</a>
          <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
          <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
        </nav>

        {/* Cart Trigger Button */}
        <button
          onClick={onOpenCart}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-sm font-bold transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Cart</span>
          {cartCount > 0 && (
            <span 
              className="ml-1 px-2 py-0.5 text-xs font-extrabold text-white rounded-full shadow-sm"
              style={{ backgroundColor: '#889FD1' }}
            >
              {cartCount}
            </span>
          )}
        </button>

      </div>
    </header>
  );
};

export default Navbar;