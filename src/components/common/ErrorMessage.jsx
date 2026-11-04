import Button from "./Button";
import "./ErrorMessage.css";

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="common-error" role="alert">
      <p>{error?.message ?? "Something went wrong. Please try again."}</p>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  );
}
