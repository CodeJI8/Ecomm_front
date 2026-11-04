import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthPanel from "../components/common/AuthPanel";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useAuth from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/validateAuthForm";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!validateEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!validatePassword(form.password)) nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setApiError("");
    try {
      await login(form);
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel title="Welcome back">
      <form onSubmit={submit} noValidate>
        <Input id="login-email" label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input id="login-password" label="Password" type="password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        {apiError && <p className="auth-panel__message" role="alert">{apiError}</p>}
        <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
        <p className="login__links"><Link to="/forgot-password">Forgot password?</Link><span>New here? <Link to="/register">Create an account</Link></span></p>
      </form>
    </AuthPanel>
  );
}
