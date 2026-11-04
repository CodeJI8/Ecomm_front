import { useCallback, useMemo, useState } from "react";
import HomeCatalog from "../components/home/HomeCatalog";
import HomeCategorySection from "../components/home/HomeCategorySection";
import HomeHero from "../components/home/HomeHero";
import useAsync from "../hooks/useAsync";
import useCart from "../hooks/useCart";
import { getCategories, getProducts } from "../api";
import { getApiData } from "../utils/getApiData";
import "../styles/Home.css";
import "../styles/HomeHero.css";
import "../styles/HomeCarousel.css";
import "../styles/HomeSections.css";
import "../styles/HomeNewsletter.css";
import "../styles/HomeResponsive.css";

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const { addItem } = useCart();
  const productsRequest = useCallback(({ signal }) => getProducts({ page: 1, limit: 20 }, { signal }), []);
  const categoriesRequest = useCallback(({ signal }) => getCategories({ signal }), []);
  const productResult = useAsync(productsRequest);
  const categoryResult = useAsync(categoriesRequest);
  const products = useMemo(() => {
    const productPayload = getApiData(productResult.data);
    return Array.isArray(productPayload?.products)
      ? productPayload.products
      : Array.isArray(productPayload?.product)
        ? productPayload.product
        : [];
  }, [productResult.data]);
  const categories = useMemo(() => {
    const categoryPayload = getApiData(categoryResult.data);
    return Array.isArray(categoryPayload)
      ? categoryPayload
      : Array.isArray(categoryPayload?.categories)
        ? categoryPayload.categories
        : [];
  }, [categoryResult.data]);
  const promoProduct = useMemo(() => products
    .filter((product) => Number(product.compareAtPrice) > Number(product.price))
    .sort((a, b) => (
      (1 - Number(b.price) / Number(b.compareAtPrice))
      - (1 - Number(a.price) / Number(a.compareAtPrice))
    ))[0], [products]);

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id]);
  }

  return (
    <main className="home-page">
      <HomeHero promoProduct={promoProduct} />
      <HomeCatalog
        products={products}
        loading={productResult.loading}
        error={productResult.error}
        onRetry={() => productResult.run()}
        onAdd={addItem}
        favoriteIds={favorites}
        onToggleFavorite={toggleFavorite}
      />
      <HomeCategorySection
        categories={categories}
        loading={categoryResult.loading}
        error={categoryResult.error}
        onRetry={() => categoryResult.run()}
      />
      <section className="home-page__newsletter">
        <div><span className="home-page__section-eyebrow">A LITTLE SOMETHING EXTRA</span><h2>Good things, delivered.</h2><p>Get updates on new arrivals, exclusive offers, and more.</p></div>
        <form className="home-page__newsletter-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); }}>
          <label className="visually-hidden" htmlFor="newsletter-email">Your email address</label>
          <input id="newsletter-email" type="email" placeholder="Your email address" required />
          <button type="submit">Subscribe ↗</button>
        </form>
      </section>
    </main>
  );
}
