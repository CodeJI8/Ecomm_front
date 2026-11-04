import "./EmptyState.css";

export default function EmptyState({ title = "Nothing here yet", children }) {
  return (
    <div className="common-empty" role="status">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
