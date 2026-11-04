import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import PageTitle from "../components/common/PageTitle";
import useAuth from "../hooks/useAuth";
import "../styles/Profile.css";

export default function Profile() {
  const { user, loading, profileError, refreshProfile, logout } = useAuth();

  if (loading) return <main className="profile-page"><Loader /></main>;
  if (profileError) return <main className="profile-page"><ErrorMessage error={profileError} onRetry={refreshProfile} /></main>;
  if (!user) return <main className="profile-page"><EmptyState title="Profile unavailable">Sign in again to view your account.</EmptyState></main>;

  return (
    <main className="profile-page">
      <PageTitle eyebrow="YOUR ACCOUNT" title="Profile" />
      <section className="profile-page__details" aria-label="Account details">
        {Object.entries({ Name: user.name, Email: user.email }).filter(([, value]) => value).map(([label, value]) => (
          <p key={label}><strong>{label}</strong><span>{value}</span></p>
        ))}
        <Button variant="secondary" onClick={logout}>Log out</Button>
      </section>
    </main>
  );
}
