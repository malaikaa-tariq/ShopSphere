import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [data, setData] = useState({ users: [], products: [], orders: [], metrics: {} });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Platform Overview...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Platform Admin Portal</h1>
        <p className="text-sm text-slate-500 mt-1">Global ecosystem performance, users, and transactions</p>
      </div>

      {/* High-Level Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Platform Revenue</p>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">${data.metrics?.totalRevenue || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Registered Users</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{data.users?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Catalog Items</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{data.products?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total System Orders</p>
          <p className="text-2xl font-extrabold text-[#8b9dc3] mt-1">{data.orders?.length || 0}</p>
        </div>
      </div>

      {/* Users & Orders Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Roles Management */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">User Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-4">Name / Email</th>
                  <th className="p-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.users?.map((u) => (
                  <tr key={u._id}>
                    <td className="p-4 font-semibold text-slate-900">{u.name || u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'seller' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Global Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.orders?.map((o) => (
                  <tr key={o._id}>
                    <td className="p-4 font-mono text-xs">{o._id}</td>
                    <td className="p-4 font-bold text-slate-900">${o.totalAmount}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">
                        {o.paymentStatus || 'paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;