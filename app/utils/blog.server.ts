export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  type: "essay" | "note" | "project";
  excerpt: string;
  category: string;
  tags?: string[];
  shader?: string;
  shaderColors?: string[];
  hue?: number;
  cover?: string;
  layout?: "wide" | "tall" | "small";
  static?: boolean;
  repo?: string;
  demo?: string;
  status?: "active" | "archived";
}

// Import all MDX files from the blog directory
const modules = import.meta.glob("../blog/*.mdx", { eager: true });

export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, mod] of Object.entries(modules)) {
    const slug = path.replace("../blog/", "").replace(".mdx", "");
    const module = mod as { frontmatter: Omit<BlogPost, "slug"> };

    if (module.frontmatter) {
      posts.push({
        slug,
        ...module.frontmatter,
        category: module.frontmatter.category || "personal",
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPost(slug: string) {
  const path = `../blog/${slug}.mdx`;
  const mod = modules[path] as
    | { frontmatter: Omit<BlogPost, "slug">; default: React.ComponentType }
    | undefined;

  if (!mod) return null;

  return {
    frontmatter: { slug, ...mod.frontmatter },
    Component: mod.default,
  };
}
