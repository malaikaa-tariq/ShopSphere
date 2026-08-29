import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "../services/api";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductDetails() {
  const { id } = useParams(); const [p, setP] = useState(null); const dispatch = useDispatch();
  useEffect(() => { api.get(`/products/${id}`).then(r => setP(r.data)); }, [id]);
  if (!p) return <main className="p-10">Loading...</main>;
  return <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-2">
    <div className="aspect-square overflow-hidden rounded-3xl bg-slate-100">{p.images?.[0] && <img src={p.images[0]} className="h-full w-full object-cover" />}</div>
    <div className="py-5"><p className="font-bold text-indigo-600">{p.category}</p><h1 className="mt-2 text-4xl font-black">{p.name}</h1><p className="mt-5 text-3xl font-black">${p.price.toFixed(2)}</p><p className="mt-5 leading-7 text-slate-600">{p.description}</p><button onClick={() => dispatch(addToCart({ product:p._id,name:p.name,price:p.price,image:p.images?.[0],quantity:1 }))} className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white">Add to cart</button></div>
  </main>;
}
