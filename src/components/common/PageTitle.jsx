import "./PageTitle.css";

export default function PageTitle({ eyebrow, title, description }) {
  return (
    <header className="page-title">
      <p className="page-title__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className="page-title__description">{description}</p>}
    </header>
  );
}
