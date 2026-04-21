import type { MetaFunction } from "@vercel/remix";
import { Link } from "@remix-run/react";
import { NOW, SITE, SITE_URL } from "~/utils/site-config";
import { TopNav, Footer } from "~/components/Layout";

export const meta: MetaFunction = () => [
  { title: `Now · ${SITE.name}` },
  {
    name: "description",
    content: `What ${SITE.name} is working on, reading, and thinking about right now.`,
  },
  { property: "og:title", content: `Now · ${SITE.name}` },
  { property: "og:url", content: `${SITE_URL}/now` },
  { tagName: "link", rel: "canonical", href: `${SITE_URL}/now` },
];

export default function Now() {
  const formatted = new Date(NOW.date + "T00:00:00Z").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" },
  );
  return (
    <>
      <main id="content">
        <h1>Now</h1>
        <p className="lede">
          What I'm working on this month. Updated {formatted}.
        </p>

        <TopNav current="/now" />

        {NOW.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </section>
        ))}

        <hr />
        <p className="muted">
          This is a <a href="https://nownownow.com/about">/now page</a>, a
          snapshot of my current focus. Older snapshots live on{" "}
          <Link to="/then">/then</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
