import React, { useState, useEffect } from 'react';

const carouselImages = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1600&q=80'
];

const AboutContact = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setSubmitted(true);
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Background Hero Carousel */}
      <div className="relative h-[420px] w-full overflow-hidden">
        {carouselImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.7)), url('${img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Connecting Vendors & Buyers Worldwide
          </h1>
          <p className="mt-3 text-slate-200 max-w-2xl text-base md:text-lg">
            ShopSphere is a next-generation multi-vendor ecosystem bringing quality products and top sellers into one unified marketplace.
          </p>
        </div>
      </div>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-12 h-12 bg-indigo-50 text-[#8b9dc3] rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              🛍️
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Multi-Vendor Marketplace</h3>
            <p className="text-slate-600 text-sm">Empowering independent sellers with custom vendor dashboards and order analytics.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              🔒
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Secure Authentication</h3>
            <p className="text-slate-600 text-sm">Strict role-based routing separating buyers, vendors, and platform administrators.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Real-Time Inventory</h3>
            <p className="text-slate-600 text-sm">Full stock management and dynamic updates across buyer checkouts.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Get in Touch</h2>
          <p className="text-center text-slate-500 mb-8">Have questions about seller accounts or order support?</p>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-center font-medium">
              Thank you! Your message has been received.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8b9dc3] focus:outline-none"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8b9dc3] focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
              <textarea
                required
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-[#8b9dc3] focus:outline-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#8b9dc3] hover:bg-[#7a8cb2] text-white font-bold py-3 rounded-xl transition uppercase tracking-wider"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AboutContact;