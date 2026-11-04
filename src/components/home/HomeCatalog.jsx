import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";
import ProductGrid from "../product/ProductGrid";

const getCategory = (product) => product.category ?? product.categories?.[0];

export default function HomeCatalog({ products, loading, error, onRetry, onAdd, favoriteIds, onToggleFavorite }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("featured");
  const saleOnly = searchParams.get("sale") === "1";
  const searchQuery = searchParams.get("q")?.trim().toLocaleLowerCase() ?? "";
  const categories = useMemo(() => {
    const names = products.map((product) => {
      const category = getCategory(product);
      return typeof category === "string" ? category : category?.name;
    }).filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [products]);
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const category = getCategory(product);
      const categoryName = typeof category === "string" ? category : category?.name;
      const searchableText = `${product.name ?? ""} ${product.description ?? ""} ${categoryName ?? ""}`.toLocaleLowerCase();
      const price = Number(product.price);
      const compareAtPrice = Number(product.compareAtPrice);
      const onSale = Number.isFinite(compareAtPrice) && compareAtPrice > price;
      const matchesPrice = !priceFilter
        || (priceFilter === "under-50" && price < 50)
        || (priceFilter === "50-100" && price >= 50 && price <= 100)
        || (priceFilter === "over-100" && price > 100);
      return (!categoryFilter || categoryName === categoryFilter)
        && matchesPrice
        && (!saleOnly || onSale)
        && (!searchQuery || searchableText.includes(searchQuery));
    });

    if (sortOrder === "price-asc") return filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortOrder === "price-desc") return filtered.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortOrder === "name") return filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [categoryFilter, priceFilter, products, saleOnly, searchQuery, sortOrder]);

  return (
    <section id="home-catalog" className="home-page__products">
      <div className="home-page__toolbar" aria-label="Filter and sort products">
        <label>
          <span className="visually-hidden">Filter by category</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span className="visually-hidden">Filter by price</span>
          <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
            <option value="">Any price</option>
            <option value="under-50">Under $50</option>
            <option value="50-100">$50–$100</option>
            <option value="over-100">Over $100</option>
          </select>
        </label>
        <button
          className={`home-page__sale-filter${saleOnly ? " is-active" : ""}`}
          type="button"
          aria-pressed={saleOnly}
          onClick={() => setSearchParams((current) => {
            if (saleOnly) current.delete("sale");
            else current.set("sale", "1");
            return current;
          })}
        >
          Offers
        </button>
        <label className="home-page__sort">
          <span className="visually-hidden">Sort products</span>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="featured">Sort by: Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      <div className="home-page__section-heading">
        <h2>Products for you<span>.</span></h2>
        {searchQuery && <p className="home-page__search-summary">Search results for “{searchQuery}”</p>}
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage error={error} onRetry={onRetry} />}
      {!loading && !error && visibleProducts.length === 0 && <EmptyState title="No products found">Try changing your filters or check back soon for new arrivals.</EmptyState>}
      {!loading && !error && visibleProducts.length > 0 && (
        <ProductGrid products={visibleProducts} className="product-grid--home" onAdd={onAdd} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />
      )}
    </section>
  );
}
