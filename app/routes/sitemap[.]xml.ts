import { getAllPosts } from "~/utils/blog.server";

const SITE_URL = "https://tomaskorenblit.com";

export const loader = () => {
  const posts = getAllPosts();

  const urls = [
    `<url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>`,
    ...posts.map(
      (post) =>
        `<url><loc>${SITE_URL}/blog/${post.slug}</loc><lastmod>${post.date}</lastmod></url>`
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join("\n  ")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
