import { Link, useLocation } from "react-router-dom";
export default function PaymentResult() {
  const ok = useLocation().pathname.includes("success");
  return <main className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="text-4xl font-black">{ok ? "Payment successful" : "Payment cancelled"}</h1><p className="mt-4 text-slate-600">{ok ? "Your order has been confirmed after Stripe payment." : "Your order was not paid."}</p><Link to="/" className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">Back to shop</Link></main>;
}
