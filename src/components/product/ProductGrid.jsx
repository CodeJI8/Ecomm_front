import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products, onAdd, favoriteIds = [], onToggleFavorite, className = "" }) {
  return (
    <div className={`product-grid ${className}`}>
      {products.map((product) => {
        const productId = product.id ?? product._id;
        return (
          <ProductCard
            key={productId}
            product={product}
            onAdd={onAdd}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favoriteIds.includes(productId)}
          />
        );
      })}
    </div>
  );
}
