import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPanel from "../components/common/AuthPanel";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useAuth from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/validateAuthForm";
import "../styles/Register.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!validateEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!validatePassword(form.password)) nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setApiError("");
    try {
      await register(form);
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel title="Create your account">
      <form onSubmit={submit} noValidate>
        <Input id="register-name" label="Name" type="text" autoComplete="name" value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Input id="register-email" label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <Input id="register-password" label="Password" type="password" autoComplete="new-password" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        {apiError && <p className="auth-panel__message" role="alert">{apiError}</p>}
        <Button type="submit" disabled={loading}>{loading ? "Creating account…" : "Register"}</Button>
        <p className="register__login">Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </AuthPanel>
  );
}
