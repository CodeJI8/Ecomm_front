const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export function getProductImages(product = {}) {
  const images = Array.isArray(product.images)
    ? product.images
    : product.images
      ? [product.images]
      : product.imageUrl
        ? [product.imageUrl]
        : product.image
        ? [product.image]
        : [];
  return images.filter(Boolean);
}

export function getImageUrl(image) {
  const value = typeof image === "string"
    ? image
    : image?.url ?? image?.path ?? image?.imageUrl;
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${apiBaseUrl.replace(/\/$/, "")}/${value.replace(/^\//, "")}`;
}
