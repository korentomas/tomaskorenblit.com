import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPost } from "~/utils/blog.server";
import type { BlogPostWithContent } from "~/types";
import Navigation from "~/components/Navigation";
import { useTheme } from "~/context/ThemeContext";
import { format } from "date-fns";
import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.post) {
    return [{ title: "Post Not Found" }];
  }

  const { post } = data as { post: BlogPostWithContent };

  return [
    { title: `${post.title} | Tomás Korenblit` },
    { name: "description", content: post.description },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.description },
    { property: "og:type", content: "article" },
    { property: "article:published_time", content: post.date },
    { property: "article:author", content: "Tomás Korenblit" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.description },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const post = await getPost(slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ post });
};

export default function BlogPost() {
  const { post } = useLoaderData<{ post: BlogPostWithContent }>();
  const { theme, toggleTheme } = useTheme();

  const Component = useMemo(() => getMDXComponent(post.content), [post.content]);

  return (
    <div className="min-h-screen bg-bg-secondary main-content-with-nav">
      <Navigation />

      <div className="theme-toggle">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-bg-element transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>

      <article className="blog-post-content">
        <Link to="/blog" className="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to all posts
        </Link>

        <header className="blog-post-header">
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            <span className="blog-post-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </span>
            <span className="blog-post-reading-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {post.readingTime}
            </span>
          </div>
          {post.tags.length > 0 && (
            <div className="blog-post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose">
          <Component />
        </div>
      </article>
    </div>
  );
}
