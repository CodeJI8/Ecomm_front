import { useCallback, useMemo } from "react";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import PageTitle from "../components/common/PageTitle";
import ImageWithPlaceholder from "../components/common/ImageWithPlaceholder";
import useAsync from "../hooks/useAsync";
import { getCategories } from "../api";
import { getApiData } from "../utils/getApiData";
import { getImageUrl } from "../utils/getImageUrl";
import "../styles/Categories.css";

function CategoryNode({ category, children }) {
  const image = getImageUrl(category.imageUrl ?? category.image);
  return (
    <li className="categories-page__item">
      <article>
        <ImageWithPlaceholder className="categories-page__image" src={image} alt={`${category.name} category`} />
        <h2>{category.name}</h2>
      </article>
      {children.length > 0 && <ul>{children.map((child) => <CategoryNode key={child.id ?? child._id} category={child} children={child.children ?? []} />)}</ul>}
    </li>
  );
}

function makeTree(categories) {
  const nodes = categories.map((category) => ({ ...category, children: [] }));
  const byId = new Map(nodes.map((category) => [String(category.id ?? category._id), category]));
  const roots = [];
  nodes.forEach((category) => {
    const parentId = category.parentId?.id ?? category.parentId?._id ?? category.parentId;
    const parent = parentId ? byId.get(String(parentId)) : null;
    if (parent) parent.children.push(category);
    else roots.push(category);
  });
  return roots;
}

export default function Categories() {
  const request = useCallback(({ signal }) => getCategories({ signal }), []);
  const { data, loading, error, run } = useAsync(request);
  const categories = useMemo(() => {
    const payload = getApiData(data);
    return Array.isArray(payload) ? payload : Array.isArray(payload?.categories) ? payload.categories : [];
  }, [data]);
  const tree = useMemo(() => makeTree(categories), [categories]);

  return (
    <main className="categories-page">
      <PageTitle eyebrow="EXPLORE NOVA" title="Categories" />
      {loading && <Loader />}
      {error && <ErrorMessage error={error} onRetry={() => run()} />}
      {!loading && !error && tree.length === 0 && <EmptyState title="No categories yet">Check back soon to explore our collections.</EmptyState>}
      {!loading && !error && tree.length > 0 && <ul className="categories-page__tree">{tree.map((category) => <CategoryNode key={category.id ?? category._id} category={category} children={category.children} />)}</ul>}
    </main>
  );
}
