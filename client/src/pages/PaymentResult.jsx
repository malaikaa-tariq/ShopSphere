import { Link, useSearchParams } from "react-router-dom";

export default function PaymentResult() {
  const [params] = useSearchParams();

  const cancelled =
    params.get("cancelled") === "true";

  return (
    <div className="form-page">
      <div className="form-card">
        <span className="eyebrow">
          Payment
        </span>

        <h1>
          {cancelled
            ? "Payment cancelled"
            : "Payment processing"}
        </h1>

        <p>
          {cancelled
            ? "Your order remains unpaid. You can return to your cart and try again."
            : "Stripe has returned you to ShopSphere. Your signed webhook will confirm the order payment."}
        </p>

        <Link className="button" to="/orders">
          View orders
        </Link>
      </div>
    </div>
  );
}