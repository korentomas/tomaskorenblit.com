import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  const robotText = `User-agent: *
Allow: /

Sitemap: https://tkoren.com/sitemap.xml`;

  return new Response(robotText, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
