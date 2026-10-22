import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { loadArticle, markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";

const description =
  "How a dielectric metasurface splits circularly polarized light into a far-field pair, why the opposite handedness changes the angles, and why leakage stays in the account.";

export const metadata: Metadata = {
  title: "Spin-tunable dielectric beam splitting",
  description,
  alternates: { canonical: `${SITE_URL}/article/` },
  openGraph: {
    title: "Spin-tunable dielectric beam splitting, and the far field that still leaks",
    description,
    type: "article",
    url: `${SITE_URL}/article/`,
  },
};

export default function ArticlePage() {
  const html = markdownToHtml(loadArticle());
  return (
    <div className="shell">
      <SiteHeader as="p" title="Beam-splitting far field" />
      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      <SiteFooter />
    </div>
  );
}
