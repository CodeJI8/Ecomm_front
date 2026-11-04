import { useState } from "react";
import AuthPanel from "../components/common/AuthPanel";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { forgotPassword } from "../api";
import { validateEmail } from "../utils/validateAuthForm";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage("If an account exists for that email, password reset instructions have been sent.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel title="Reset your password">
      <form onSubmit={submit} noValidate>
        <p>Enter your account email and we’ll send reset instructions.</p>
        <Input id="forgot-email" label="Email" type="email" autoComplete="email" value={email} error={error} onChange={(event) => setEmail(event.target.value)} required />
        {message && <p className="forgot-password__success" role="status">{message}</p>}
        <Button type="submit" disabled={loading}>{loading ? "Sending…" : "Send instructions"}</Button>
      </form>
    </AuthPanel>
  );
}
