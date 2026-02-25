import type { BlogPost } from "~/utils/blog.server";
import { CATEGORIES } from "~/utils/site-config";
import { getAllTags } from "~/utils/blog.server";

interface FilterBarProps {
  posts: BlogPost[];
  activeFilter: { type: "category" | "tag"; value: string } | null;
  onFilter: (filter: { type: "category" | "tag"; value: string } | null) => void;
}

export function FilterBar({ posts, activeFilter, onFilter }: FilterBarProps) {
  const categoryCounts = new Map<string, number>();
  for (const post of posts) {
    if (post.category) {
      categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
    }
  }

  const visibleCategories = CATEGORIES.filter((c) => (categoryCounts.get(c.slug) ?? 0) > 0);
  const tags = getAllTags(posts);

  // Don't render if only one category and no tags
  if (visibleCategories.length <= 1 && tags.length === 0) return null;

  const isActive = (type: "category" | "tag", value: string) =>
    activeFilter?.type === type && activeFilter.value === value;

  const handleClick = (type: "category" | "tag", value: string) => {
    if (isActive(type, value)) {
      onFilter(null);
    } else {
      onFilter({ type, value });
    }
  };

  return (
    <nav className="filter-bar" aria-label="Filter posts">
      <div className="filter-bar-scroll">
        <button
          className={`filter-pill${!activeFilter ? " filter-pill--active" : ""}`}
          onClick={() => onFilter(null)}
          aria-pressed={!activeFilter}
        >
          All ({posts.length})
        </button>

        {visibleCategories.map((cat) => (
          <button
            key={cat.slug}
            className={`filter-pill${isActive("category", cat.slug) ? " filter-pill--active" : ""}`}
            onClick={() => handleClick("category", cat.slug)}
            aria-pressed={isActive("category", cat.slug)}
            aria-label={`Filter by ${cat.label}`}
          >
            {cat.label} ({categoryCounts.get(cat.slug) ?? 0})
          </button>
        ))}

        {tags.length > 0 && (
          <>
            <span className="filter-divider" aria-hidden="true" />
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                className={`filter-pill filter-pill--tag${isActive("tag", tag) ? " filter-pill--active" : ""}`}
                onClick={() => handleClick("tag", tag)}
                aria-pressed={isActive("tag", tag)}
                aria-label={`Filter by ${tag}`}
              >
                {tag} ({count})
              </button>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}
