import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart } from "../features/cart/cartSlice";

export default function Cart() {
  const items = useSelector(s => s.cart.items); const dispatch = useDispatch(); const navigate = useNavigate();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (!items.length) return <main className="mx-auto max-w-3xl px-5 py-16 text-center"><h1 className="text-3xl font-black">Your cart is empty</h1><Link to="/" className="mt-5 inline-block text-indigo-600">Continue shopping</Link></main>;

  return <main className="mx-auto max-w-5xl px-5 py-10">
    <h1 className="text-3xl font-black">Shopping cart</h1>
    <div className="mt-7 space-y-3">{items.map(i => <div key={i.product} className="flex items-center justify-between rounded-2xl border bg-white p-4">
      <div><b>{i.name}</b><p className="text-sm text-slate-500">${i.price} × {i.quantity}</p></div>
      <button onClick={() => dispatch(removeFromCart(i.product))} className="text-red-600">Remove</button>
    </div>)}</div>
    <div className="mt-7 flex items-center justify-between rounded-2xl bg-slate-900 p-5 text-white"><span>Total</span><b>${total.toFixed(2)}</b></div>
    <button onClick={() => navigate("/checkout")} className="mt-4 w-full rounded-xl bg-indigo-600 p-3 font-bold text-white">Checkout</button>
  </main>;
}
