import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";
import ImageWithPlaceholder from "../common/ImageWithPlaceholder";
import { getImageUrl } from "../../utils/getImageUrl";

export default function HomeCategorySection({ categories, loading, error, onRetry }) {
  return (
    <section className="home-page__categories" id="categories">
      <div className="home-page__section-heading">
        <div><span className="home-page__section-eyebrow">FIND YOUR STYLE</span><h2>Shop by category</h2></div>
        <Link to="/categories" className="home-page__text-link">Explore everything ↗</Link>
      </div>
      {loading && <Loader />}
      {error && <ErrorMessage error={error} onRetry={onRetry} />}
      {!loading && !error && categories.length === 0 && <EmptyState title="No categories yet">Check back soon to explore our collections.</EmptyState>}
      {!loading && !error && categories.length > 0 && (
        <div className="home-page__category-grid">
          {categories.slice(0, 4).map((category, index) => {
            const image = getImageUrl(category.imageUrl ?? category.image);
            return (
              <Link className="home-page__category-card" to="/categories" key={category.id ?? category._id}>
                <ImageWithPlaceholder className="home-page__category-image" src={image} alt={`${category.name} category`} />
                <div className="home-page__category-overlay" />
                <div className="home-page__category-info"><span>0{index + 1}</span><h3>{category.name}</h3><span className="home-page__category-arrow">↗</span></div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
