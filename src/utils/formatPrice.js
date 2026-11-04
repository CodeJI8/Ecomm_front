export function formatPrice(value, currency = "USD") {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price unavailable";

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
}
