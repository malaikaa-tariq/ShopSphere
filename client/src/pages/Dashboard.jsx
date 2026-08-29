import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../services/api";

export default function Dashboard({ type }) {
  const user = useSelector(s => s.auth.user); const [data, setData] = useState(null);
  useEffect(() => {
    const url = type === "admin" ? "/admin/overview" : "/orders/seller";
    api.get(url).then(r => setData(r.data));
  }, [type]);
  if (!user || (type === "admin" && user.role !== "admin") || (type === "seller" && !["seller","admin"].includes(user.role))) return <main className="p-10">Access denied</main>;
  return <main className="mx-auto max-w-7xl px-5 py-10"><h1 className="text-3xl font-black">{type === "admin" ? "Admin Dashboard" : "Seller Dashboard"}</h1><pre className="mt-7 overflow-auto rounded-2xl bg-slate-900 p-5 text-sm text-white">{JSON.stringify(data, null, 2)}</pre></main>;
}
