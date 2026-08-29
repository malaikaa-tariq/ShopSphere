import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useDispatch } from "react-redux";
import { setSession } from "../features/auth/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch(); const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      dispatch(setSession(data));
      navigate("/");
    } catch (e) { setError(e.response?.data?.message || "Login failed"); }
  }

  return <AuthForm title="Welcome back" form={form} setForm={setForm} submit={submit} error={error} submitText="Login" footer={<Link to="/register" className="text-indigo-600">Create account</Link>} />;
}

function AuthForm({ title, form, setForm, submit, error, submitText, footer }) {
  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <form onSubmit={submit} className="rounded-3xl border bg-white p-7 shadow-sm">
        <h1 className="text-3xl font-black">{title}</h1>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input required type="email" placeholder="Email" className="mt-6 w-full rounded-xl border p-3" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/>
        <input required type="password" placeholder="Password" className="mt-3 w-full rounded-xl border p-3" value={form.password} onChange={e => setForm({...form,password:e.target.value})}/>
        <button className="mt-5 w-full rounded-xl bg-indigo-600 p-3 font-bold text-white">{submitText}</button>
        <div className="mt-4 text-center text-sm">{footer}</div>
      </form>
    </main>
  );
}
