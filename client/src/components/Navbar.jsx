import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector(
    (state) =>
      state.cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      )
  );

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/products" onClick={() => setOpen(false)}>
            Marketplace
          </NavLink>

          {user && (
            <NavLink
              to="/orders"
              onClick={() => setOpen(false)}
            >
              Orders
            </NavLink>
          )}

          {user && ["seller", "admin"].includes(user.role) && (
            <NavLink
              to="/dashboard"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </NavLink>
          )}

          <Link
            className="cart-link"
            to="/cart"
            onClick={() => setOpen(false)}
          >
            <ShoppingCart size={18} />
            Cart
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          {user ? (
            <button
              className="nav-user"
              onClick={handleLogout}
            >
              <UserRound size={17} />
              {user.name}
              <LogOut size={15} />
            </button>
          ) : (
            <Link
              className="button button-small"
              to="/auth?mode=login"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}