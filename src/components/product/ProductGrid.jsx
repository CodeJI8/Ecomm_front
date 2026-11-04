import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products, onAdd, favoriteIds = [], onToggleFavorite, className = "" }) {
  return (
    <div className={`product-grid ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id ?? product._id}
          product={product}
          onAdd={onAdd}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.includes(product.id ?? product._id)}
        />
      ))}
    </div>
  );
}
