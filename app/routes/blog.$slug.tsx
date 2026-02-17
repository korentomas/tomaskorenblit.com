import type { LoaderFunctionArgs, MetaFunction } from "@vercel/remix";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPost, getAllPosts } from "~/utils/blog.server";
import { Spoiler, Typewriter } from "~/components/EasterEgg";
import { Comments } from "~/components/Comments";
import { ShaderBanner } from "~/components/ShaderBanner";

const mdxComponents = {
  Spoiler,
  Typewriter,
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug;
  if (!slug) throw redirect("/");

  const post = getPost(slug);
  if (!post) throw redirect("/");

  return json({
    frontmatter: post.frontmatter,
    slug,
  });
};

const SITE_URL = "https://korenblit.vercel.app";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Tomás Korenblit" }];
  const { frontmatter, slug } = data;
  const title = `${frontmatter.title} — Tomás Korenblit`;
  const url = `${SITE_URL}/blog/${slug}`;
  const image = frontmatter.cover
    ? `${SITE_URL}${frontmatter.cover}`
    : `${SITE_URL}/og-image.png`;

  return [
    { title },
    { name: "description", content: frontmatter.excerpt },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    { property: "og:title", content: frontmatter.title },
    { property: "og:description", content: frontmatter.excerpt },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: frontmatter.title },
    { name: "twitter:description", content: frontmatter.excerpt },
    { name: "twitter:image", content: image },
    { tagName: "link", rel: "canonical", href: url },
    {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: frontmatter.title,
        description: frontmatter.excerpt,
        datePublished: frontmatter.date,
        url,
        author: {
          "@type": "Person",
          name: "Tomás Korenblit",
        },
      }),
    },
  ];
};

export default function BlogPost() {
  const { slug, frontmatter } = useLoaderData<typeof loader>();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    import(`../blog/${slug}.mdx`).then((mod) => {
      setComponent(() => mod.default);
    });
  }, [slug]);

  return (
    <div className="post-overlay" style={{ position: "relative" }}>
      <article className="post-expanded" style={{ borderTop: `3px solid ${frontmatter.accent || "var(--accent)"}` }}>
        <motion.a
          href="/"
          className="post-back"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
        >
          &larr; Back
        </motion.a>
        {frontmatter.shader && (
          <div style={{ marginBottom: "2rem", borderRadius: "var(--tile-radius)", overflow: "hidden" }}>
            <ShaderBanner
              shader={frontmatter.shader}
              colors={frontmatter.shaderColors}
              height="180px"
            />
          </div>
        )}
        {frontmatter.cover && !frontmatter.shader && (
          <div style={{ marginBottom: "2rem", borderRadius: "var(--tile-radius)", overflow: "hidden" }}>
            <img src={frontmatter.cover} alt={frontmatter.title} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
          </div>
        )}
        <header className="post-header">
          <div className="post-meta">
            {frontmatter.type} ·{" "}
            {new Date(frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="post-title">{frontmatter.title}</h1>
        </header>
        <div className="post-content">
          {Component ? <Component components={mdxComponents} /> : null}
        </div>
        <Comments slug={slug} />
      </article>
    </div>
  );
}
