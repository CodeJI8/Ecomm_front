import { Navigate, useLocation } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, token, loading, profileError, refreshProfile } = useAuth();
  const location = useLocation();

  if (loading) return <main><Loader label="Checking your account" /></main>;
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  if (profileError) return <main><ErrorMessage error={profileError} onRetry={refreshProfile} /></main>;
  if (!user) return <main><Loader label="Loading your profile" /></main>;
  return children;
}
