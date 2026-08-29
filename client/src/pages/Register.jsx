import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useDispatch } from "react-redux";
import { setSession } from "../features/auth/authSlice";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");
  const dispatch = useDispatch(); const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      dispatch(setSession(data)); navigate("/");
    } catch (e) { setError(e.response?.data?.message || "Registration failed"); }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <form onSubmit={submit} className="rounded-3xl border bg-white p-7 shadow-sm">
        <h1 className="text-3xl font-black">Create account</h1>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input required placeholder="Full name" className="mt-6 w-full rounded-xl border p-3" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/>
        <input required type="email" placeholder="Email" className="mt-3 w-full rounded-xl border p-3" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
        <input required minLength="6" type="password" placeholder="Password" className="mt-3 w-full rounded-xl border p-3" value={form.password} onChange={e => setForm({...form,password:e.target.value})}/>
        <select className="mt-3 w-full rounded-xl border p-3" value={form.role} onChange={e => setForm({...form,role:e.target.value})}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button className="mt-5 w-full rounded-xl bg-indigo-600 p-3 font-bold text-white">Create account</button>
        <p className="mt-4 text-center text-sm"><Link to="/login" className="text-indigo-600">Already have an account?</Link></p>
      </form>
    </main>
  );
}
