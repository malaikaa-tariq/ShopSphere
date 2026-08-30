import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
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
              <span className="text-2xl font-black tracking-tight text-white">
                Shop<span style={{ color: '#889FD1' }}>Sphere</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Your primary destination for high-quality electronics, modern fashion, and luxury home essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Catalog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Featured Items</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Special Offers</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Help & FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
            </ul>
          </div>

          {/* Interactive Newsletter Subscription */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">STAY UPDATED</h4>
            <p className="text-xs mb-3 text-slate-400">Subscribe for discounts and product drops.</p>
            
            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs font-semibold">
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all active:scale-95 hover:opacity-90 shrink-0 shadow-sm"
                  style={{ backgroundColor: '#889FD1' }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;