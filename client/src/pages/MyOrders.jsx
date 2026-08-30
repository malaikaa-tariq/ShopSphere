import React, { useState, useEffect } from 'react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ productId: null, rating: 5, comment: '' });

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products/${reviewForm.productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewForm.rating, comment: reviewForm.comment })
      });
      if (res.ok) {
        alert('Review submitted successfully!');
        setReviewForm({ productId: null, rating: 5, comment: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading your orders...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">My Purchases</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Order ID</p>
                <p className="font-mono text-sm font-semibold text-slate-800">{order._id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                <span className="inline-block mt-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                  {order.orderStatus || 'Confirmed'}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div key={item.product?._id || item._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{item.product?.name || item.name || 'Purchased Item'}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => setReviewForm({ ...reviewForm, productId: item.product?._id || item.product })}
                    className="text-xs text-[#8b9dc3] font-bold hover:underline"
                  >
                    Write Review
                  </button>
                </div>
              ))}
            </div>

            {/* Modal/Form for reviewing */}
            {reviewForm.productId && (
              <form onSubmit={handleReviewSubmit} className="mt-4 p-4 bg-slate-50 rounded-xl space-y-3">
                <p className="text-xs font-bold text-slate-700">Write a Review</p>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="p-2 border rounded-lg text-xs"
                >
                  <option value={5}>★★★★★ (5/5)</option>
                  <option value={4}>★★★★☆ (4/5)</option>
                  <option value={3}>★★★☆☆ (3/5)</option>
                  <option value={2}>★★☆☆☆ (2/5)</option>
                  <option value={1}>★☆☆☆☆ (1/5)</option>
                </select>
                <textarea
                  placeholder="Share feedback about your purchase..."
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-2 border rounded-lg text-xs outline-none"
                />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-[#8b9dc3] text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewForm({ productId: null, rating: 5, comment: '' })}
                    className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            You have not placed any orders yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;