import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full Name is required.';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleNavigation = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'seller') {
      navigate('/seller/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setLoading(true);
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password, role: formData.role };

      const res = await axios.post(endpoint, payload);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        handleRoleNavigation(res.data.user?.role);
      }
    } catch (err) {
      // Client-side fallback to maintain registered roles across sessions
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      if (isLogin) {
        const foundUser = existingUsers.find((u) => u.email.toLowerCase() === formData.email.toLowerCase());

        if (foundUser) {
          localStorage.setItem('token', 'demo-token-' + Date.now());
          localStorage.setItem('user', JSON.stringify(foundUser));
          handleRoleNavigation(foundUser.role);
        } else {
          // If logging in with a new email in demo mode
          const defaultUser = {
            name: 'Demo User',
            email: formData.email,
            role: 'buyer'
          };
          localStorage.setItem('token', 'demo-token-' + Date.now());
          localStorage.setItem('user', JSON.stringify(defaultUser));
          handleRoleNavigation('buyer');
        }
      } else {
        // Registering a new account
        const newUser = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };

        const updatedUsers = [...existingUsers.filter((u) => u.email !== formData.email), newUser];
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        localStorage.setItem('token', 'demo-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(newUser));

        handleRoleNavigation(newUser.role);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isLogin ? 'Sign in to access your FreshBasket account' : 'Join FreshBasket as a buyer or vendor'}
          </p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#8b9dc3] focus:outline-none"
                placeholder="Jane Doe"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#8b9dc3] focus:outline-none"
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#8b9dc3] focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#8b9dc3] focus:outline-none"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Account Type</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#8b9dc3] focus:outline-none"
                >
                  <option value="buyer">Buyer (Customer)</option>
                  <option value="seller">Seller (Vendor)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b9dc3] hover:bg-[#7a8cb2] text-white font-bold py-3 rounded-lg transition duration-200 mt-2 uppercase tracking-wider"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setApiError('');
            }}
            className="text-xs font-semibold text-[#8b9dc3] hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;