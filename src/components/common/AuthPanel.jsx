import "./AuthPanel.css";

export default function AuthPanel({ title, children }) {
  return (
    <main className="auth-panel">
      <section className="auth-panel__card" aria-labelledby="auth-panel-title">
        <h1 id="auth-panel-title">{title}</h1>
        {children}
      </section>
    </main>
  );
}
