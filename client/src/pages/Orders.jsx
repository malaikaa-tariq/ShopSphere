import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/mine")
      .then(({ data }) =>
        setOrders(data.orders || data || [])
      )
      .catch((err) =>
        setError(
          err.response?.data?.message ||
            "Unable to load orders."
        )
      );
  }, []);

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">
          Buyer account
        </span>

        <h1 className="page-title">
          My orders
        </h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="order-list">
          {orders.map((order) => (
            <Link
              to={`/orders/${order._id}`}
              className="order-card"
              key={order._id}
            >
              <div>
                <span>Order</span>
                <strong>
                  #{order._id.slice(-8).toUpperCase()}
                </strong>
              </div>

              <div>
                <span>Payment</span>
                <strong>
                  {order.paymentStatus}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {order.orderStatus}
                </strong>
              </div>

              <div>
                <span>Total</span>
                <strong>
                  ${Number(order.total).toFixed(2)}
                </strong>
              </div>
            </Link>
          ))}

          {!orders.length && !error && (
            <div className="empty">
              You have no orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}