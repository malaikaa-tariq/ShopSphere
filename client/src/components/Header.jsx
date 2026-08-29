import { Link } from "react-router-dom";
import { ShoppingCart, Store } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const { user } = useSelector(s => s.auth);
  const count = useSelector(s => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="text-2xl font-black text-indigo-600">ShopSphere</Link>
        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link to="/">Shop</Link>
          {user?.role === "seller" && <Link to="/seller"><Store size={18}/></Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          <Link to="/cart" className="relative"><ShoppingCart size={20}/>{count > 0 && <span className="absolute -right-3 -top-3 rounded-full bg-indigo-600 px-1.5 text-xs text-white">{count}</span>}</Link>
          {user ? <button onClick={() => dispatch(logout())}>Logout</button> : <Link to="/login">Login</Link>}
        </nav>
      </div>
    </header>
  );
}
