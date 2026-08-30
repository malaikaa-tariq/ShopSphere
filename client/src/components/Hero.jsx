import React from 'react';

const Hero = () => {
  return (
    <section 
      className="relative py-16 px-4 sm:px-6 lg:px-8 bg-cover bg-center text-slate-900 shadow-sm"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.4)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80')`
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Compact Glassmorphism Container */}
        <div className="bg-white/80 backdrop-blur-md px-6 py-8 sm:p-10 text-center space-y-6 rounded-3xl shadow-xl border border-white/40">
          
          <div className="space-y-2">
            <span 
              className="inline-block px-4 py-1 text-[11px] font-bold tracking-widest uppercase text-white rounded-full shadow-sm"
              style={{ backgroundColor: '#889FD1' }}
            >
              Discover Our Catalog
            </span>

            {/* Cursive Accent Line */}
            <p className="font-cursive text-3xl sm:text-4xl text-slate-800 pt-1 tracking-wide font-normal">
              Explore Curated Items
            </p>

            {/* Title matching Navbar Logo styling */}
            <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-slate-900 leading-tight">
              <span className="text-slate-600 font-normal">at </span>
              <span className="font-black">
                Shop<span style={{ color: '#889FD1' }}>Sphere</span>
              </span>
            </h1>
          </div>

          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-lg mx-auto leading-relaxed tracking-wide">
            Premium products across tech, fashion, home decor, and personal care.
          </p>

          <div className="pt-2">
            <a
              href="#featured"
              className="inline-block px-7 py-3 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-md transition-all active:scale-95 hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: '#889FD1' }}
            >
              Browse Products
            </a>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;