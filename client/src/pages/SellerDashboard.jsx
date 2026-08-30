import React, { useState, useEffect } from 'react';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', description: '', image: '' });

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const [resProducts, resOrders] = await Promise.all([
        fetch(`${API_URL}/products/seller`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/orders/seller`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (resProducts.ok) setProducts(await resProducts.json());
      if (resOrders.ok) setOrders(await resOrders.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: '' });
        fetchSellerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchSellerData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Vendor Portal...</div>;

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Vendor Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your storefront inventory and buyer purchases</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition ${
              activeTab === 'products' ? 'bg-[#8b9dc3] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition ${
              activeTab === 'orders' ? 'bg-[#8b9dc3] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Active Products</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Received Orders</p>
          <p className="text-2xl font-extrabold text-[#8b9dc3] mt-1">{orders.length}</p>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                required
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8b9dc3] outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price ($)"
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8b9dc3] outline-none"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  required
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8b9dc3] outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Category"
                required
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8b9dc3] outline-none"
              />
              <input
                type="url"
                placeholder="Image URL"
                required
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8b9dc3] outline-none"
              />
              <textarea
                placeholder="Description"
                required
                rows="3"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#8b9dc3] outline-none"
              />
              <button
                type="submit"
                className="w-full bg-[#8b9dc3] hover:bg-[#7a8cb2] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition"
              >
                Publish Product
              </button>
            </form>
          </div>

          {/* Product Listing Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Your Catalog</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-900 flex items-center space-x-3">
                        <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <span>{item.name}</span>
                      </td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4 font-semibold text-slate-900">${item.price}</td>
                      <td className="p-4">{item.stock} units</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(item._id)}
                          className="text-rose-600 hover:text-rose-800 font-bold text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400">No products added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Orders View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Storefront Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord._id}>
                    <td className="p-4 font-mono text-xs">{ord._id}</td>
                    <td className="p-4">{ord.user?.name || ord.user?.email || 'Buyer'}</td>
                    <td className="p-4 font-bold text-slate-900">${ord.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {ord.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="p-4 font-semibold capitalize">{ord.orderStatus || 'processing'}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">No customer orders placed yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;