import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { setCredentials } from "../features/auth/authSlice";
import Logo from "../components/Logo";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mode, setMode] = useState(
    searchParams.get("mode") === "register"
      ? "register"
      : "login"
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  };

  const validate = () => {
    if (mode === "register" && form.name.trim().length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (form.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (
      mode === "register" &&
      form.password !== form.confirmPassword
    ) {
      return "Passwords do not match.";
    }

    return "";
  };

  const submit = async (event) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        mode === "login"
          ? "/auth/login"
          : "/auth/register";

      const payload =
        mode === "login"
          ? {
              email: form.email,
              password: form.password,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
            };

      const { data } = await api.post(endpoint, payload);

      dispatch(setCredentials(data));

      navigate(
        data.user.role === "buyer"
          ? "/"
          : "/dashboard"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <form className="form-card" onSubmit={submit}>
        <Logo />

        <div style={{ marginTop: 25 }}>
          <span className="eyebrow">
            {mode === "login"
              ? "Welcome back"
              : "Create account"}
          </span>

          <h1>
            {mode === "login"
              ? "Sign in to ShopSphere"
              : "Join the marketplace"}
          </h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {mode === "register" && (
          <>
            <div className="form-group">
              <label>Name</label>

              <div className="input-icon">
                <UserRound size={17} />
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Account type</label>

              <select
                name="role"
                value={form.role}
                onChange={update}
              >
                <option value="buyer">
                  Buyer
                </option>

                <option value="seller">
                  Seller
                </option>
              </select>

              <small>
                Admin accounts are created securely by the
                server administrator.
              </small>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Email</label>

          <div className="input-icon">
            <Mail size={17} />

            <input
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="input-icon">
            <LockKeyhole size={17} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={update}
              placeholder="Minimum 8 characters"
              autoComplete={
                mode === "login"
                  ? "current-password"
                  : "new-password"
              }
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label>Confirm password</label>

            <div className="input-icon">
              <LockKeyhole size={17} />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={update}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
              >
                {showConfirm ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </div>
        )}

        <button
          className="button"
          style={{ width: "100%" }}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign in"
            : "Create account"}
        </button>

        <p style={{ color: "#8f93a2", fontSize: 13 }}>
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}

          <button
            type="button"
            className="text-button"
            onClick={() => {
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              );

              setError("");
            }}
          >
            {mode === "login"
              ? "Create one"
              : "Sign in"}
          </button>
        </p>

        <Link to="/" style={{ color: "#777b8a", fontSize: 13 }}>
          ← Continue shopping
        </Link>
      </form>
    </div>
  );
}