import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Checkout() {
  const items = useSelector(s => s.cart.items); const user = useSelector(s => s.auth.user);
  const [address, setAddress] = useState({ fullName: user?.name || "", address: "", city: "", country: "", postalCode: "" });
  const [error, setError] = useState(""); const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      const { data: order } = await api.post("/orders", { items, shippingAddress: address });
      const { data: checkout } = await api.post("/payments/checkout", { orderId: order._id });
      window.location.href = checkout.url;
    } catch (e) { setError(e.response?.data?.message || "Checkout failed"); }
  }

  return <main className="mx-auto max-w-xl px-5 py-10">
    <form onSubmit={submit} className="rounded-3xl border bg-white p-7 shadow-sm">
      <h1 className="text-3xl font-black">Checkout</h1>
      {error && <p className="mt-3 text-red-600">{error}</p>}
      {Object.keys(address).map(key => <input key={key} required placeholder={key.replace(/([A-Z])/g," $1")} className="mt-3 w-full rounded-xl border p-3" value={address[key]} onChange={e => setAddress({...address,[key]:e.target.value})}/>)}
      <button className="mt-5 w-full rounded-xl bg-indigo-600 p-3 font-bold text-white">Pay with Stripe</button>
    </form>
  </main>;
}
