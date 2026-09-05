import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();

  const items = useSelector(
    (state) => state.cart.items
  );

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  const update = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (
      Object.values(form).some(
        (value) => !value.trim()
      )
    ) {
      setError("Please complete every address field.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/orders", {
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress: form,
      });

      const payment = await api.post(
        "/payments/checkout",
        {
          orderId: data.order._id,
        }
      );

      window.location.href = payment.data.url;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Checkout could not be started."
      );
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container checkout-layout">
        <form
          className="form-card"
          onSubmit={submit}
        >
          <span className="eyebrow">
            Secure checkout
          </span>

          <h1 className="page-title">
            Shipping details
          </h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {[
            ["fullName", "Full name"],
            ["address", "Address"],
            ["city", "City"],
            ["country", "Country"],
            ["postalCode", "Postal code"],
          ].map(([name, label]) => (
            <div className="form-group" key={name}>
              <label>{label}</label>

              <input
                name={name}
                value={form[name]}
                onChange={update}
                placeholder={label}
              />
            </div>
          ))}

          <button
            className="button"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading
              ? "Redirecting to Stripe..."
              : `Pay $${total.toFixed(2)}`}
          </button>
        </form>

        <aside className="summary-card">
          <span className="eyebrow">
            Order total
          </span>

          <h2>
            ${total.toFixed(2)}
          </h2>

          <p>
            You will be securely redirected to Stripe
            Checkout to complete payment.
          </p>
        </aside>
      </div>
    </div>
  );
}