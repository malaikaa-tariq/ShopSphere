import { useEffect, useState } from "react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const { data } = await api.get("/products", { params: q ? { q } : {} });
    setProducts(data);
  };
  useEffect(() => { load(); }, []);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <section className="rounded-3xl bg-slate-900 px-8 py-14 text-white">
        <p className="font-bold text-indigo-300">MULTI-VENDOR MARKETPLACE</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black md:text-6xl">Discover products from independent sellers.</h1>
        <p className="mt-4 max-w-2xl text-slate-300">A complete MERN marketplace with seller dashboards, orders, reviews and Stripe checkout.</p>
        <div className="mt-7 flex max-w-xl gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..." className="w-full rounded-xl px-4 py-3 text-slate-900" />
          <button onClick={load} className="rounded-xl bg-indigo-500 px-5 font-bold">Search</button>
        </div>
      </section>
      <section className="py-10">
        <h2 className="mb-5 text-2xl font-black">Featured products</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
    </main>
  );
}
