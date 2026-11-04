import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthPanel from "../components/common/AuthPanel";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { resetPassword } from "../api";
import { validatePassword } from "../utils/validateAuthForm";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!token) {
      setError("The password reset link is missing its token.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword({ token, newPassword: password });
      navigate("/login", { replace: true, state: { passwordReset: true } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPanel title="Choose a new password">
      <form onSubmit={submit} noValidate>
        {!token && <p className="reset-password__hint">Open the reset link from your email to continue.</p>}
        <Input id="reset-password" label="New password" type="password" autoComplete="new-password" value={password} error={error} onChange={(event) => setPassword(event.target.value)} required />
        <Button type="submit" disabled={loading || !token}>{loading ? "Saving…" : "Save new password"}</Button>
      </form>
    </AuthPanel>
  );
}
