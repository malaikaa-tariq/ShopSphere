import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const endpoint =
          user.role === "admin"
            ? "/admin/overview"
            : "/orders/seller";

        const { data } = await api.get(endpoint);
        setData(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load dashboard."
        );
      }
    };

    load();
  }, [user.role]);

  if (error) {
    return (
      <div className="page container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page container">
        Loading dashboard...
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="page">
        <div className="container">
          <span className="eyebrow">
            Administration
          </span>

          <h1 className="page-title">
            Admin control center
          </h1>

          <div className="dashboard-grid">
            <div className="stat-card">
              <span>Users</span>
              <strong>{data.stats.users}</strong>
            </div>

            <div className="stat-card">
              <span>Sellers</span>
              <strong>{data.stats.sellers}</strong>
            </div>

            <div className="stat-card">
              <span>Products</span>
              <strong>{data.stats.products}</strong>
            </div>

            <div className="stat-card">
              <span>Orders</span>
              <strong>{data.stats.orders}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span>Paid revenue</span>
            <strong>
              ${Number(data.stats.revenue).toFixed(2)}
            </strong>
          </div>

          <h2 style={{ marginTop: 40 }}>
            Recent orders
          </h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      #{order._id.slice(-8)}
                    </td>

                    <td>
                      {order.buyer?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      ${Number(order.total).toFixed(2)}
                    </td>

                    <td>
                      {order.paymentStatus}
                    </td>

                    <td>
                      {order.orderStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const orders = data.orders || [];

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">
          Seller workspace
        </span>

        <h1 className="page-title">
          Seller dashboard
        </h1>

        <div className="dashboard-grid">
          <div className="stat-card">
            <span>Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="stat-card">
            <span>Revenue</span>
            <strong>
              $
              {orders
                .filter(
                  (order) =>
                    order.paymentStatus === "paid"
                )
                .reduce(
                  (sum, order) =>
                    sum + Number(order.total),
                  0
                )
                .toFixed(2)}
            </strong>
          </div>
        </div>

        <h2>Seller orders</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Buyer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    #{order._id.slice(-8)}
                  </td>

                  <td>
                    {order.buyer?.name ||
                      "Buyer"}
                  </td>

                  <td>
                    ${Number(order.total).toFixed(2)}
                  </td>

                  <td>
                    {order.orderStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}