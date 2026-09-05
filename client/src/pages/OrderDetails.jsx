import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const statuses = [
  "processing",
  "confirmed",
  "shipped",
  "delivered",
];

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [review, setReview] = useState({
    productId: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then(({ data }) =>
        setOrder(data.order || data)
      )
      .catch((err) =>
        setError(
          err.response?.data?.message ||
            "Unable to load order."
        )
      );
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();

    if (!review.productId || !review.comment.trim()) {
      return;
    }

    try {
      await api.post(
        `/products/${review.productId}/reviews`,
        {
          rating: Number(review.rating),
          comment: review.comment,
        }
      );

      setReview({
        productId: "",
        rating: 5,
        comment: "",
      });

      alert("Review submitted successfully.");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to submit review."
      );
    }
  };

  if (error) {
    return (
      <div className="page container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page container">
        Loading order...
      </div>
    );
  }

  const currentIndex = statuses.indexOf(
    order.orderStatus
  );

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">
          Order tracking
        </span>

        <h1 className="page-title">
          #{order._id.slice(-8).toUpperCase()}
        </h1>

        <div className="tracking">
          {statuses.map((status, index) => (
            <div
              className={
                index <= currentIndex
                  ? "tracking-step active"
                  : "tracking-step"
              }
              key={status}
            >
              <span>{index + 1}</span>
              <strong>{status}</strong>
            </div>
          ))}
        </div>

        <div className="order-detail-grid">
          <div>
            <h2>Items</h2>

            {order.items.map((item) => (
              <div
                className="order-item"
                key={item.product}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.quantity} × $
                    {Number(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <aside className="summary-card">
            <span className="eyebrow">
              Payment
            </span>

            <h2>
              ${Number(order.total).toFixed(2)}
            </h2>

            <p>
              Payment status:{" "}
              <strong>
                {order.paymentStatus}
              </strong>
            </p>
          </aside>
        </div>

        {order.orderStatus === "delivered" && (
          <form
            className="form-card"
            onSubmit={submitReview}
            style={{ marginTop: 35 }}
          >
            <span className="eyebrow">
              Verified delivery
            </span>

            <h2>Leave a review</h2>

            <div className="form-group">
              <label>Product</label>

              <select
                value={review.productId}
                onChange={(event) =>
                  setReview({
                    ...review,
                    productId: event.target.value,
                  })
                }
              >
                <option value="">
                  Select a product
                </option>

                {order.items.map((item) => (
                  <option
                    value={item.product}
                    key={item.product}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rating</label>

              <select
                value={review.rating}
                onChange={(event) =>
                  setReview({
                    ...review,
                    rating: event.target.value,
                  })
                }
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option
                    value={rating}
                    key={rating}
                  >
                    {"★".repeat(rating)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Comment</label>

              <textarea
                rows="4"
                value={review.comment}
                onChange={(event) =>
                  setReview({
                    ...review,
                    comment: event.target.value,
                  })
                }
                placeholder="Tell other shoppers about it..."
              />
            </div>

            <button className="button">
              Submit review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}