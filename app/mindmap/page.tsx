import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { SITE_URL, withBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mechanism mindmap",
  description:
    "Mindmap separating cited facts, the geometric-phase convention, and schematic drawing choices for a dielectric metasurface beam splitter.",
  alternates: { canonical: `${SITE_URL}/mindmap/` },
};

export default function MindmapPage() {
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "mindmap.svg"), "utf8");
  return (
    <div className="shell">
      <SiteHeader as="p" title="Mechanism mindmap" />
      <main className="prose">
        <p>
          Read the center as the claim, the left as the aperture physics, and the right as the far-field accounts. The bottom-right leaf is the evidence boundary: abstract, review table, diagram convention, and schematic wavefronts are not the same kind of statement.
        </p>
        <figure className="figure-frame">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
          <figcaption>
            Design 2 from the review prose is named in the player’s closing frame and left off this map, because a same-side pair should not be sketched from one sentence.{" "}
            <a href={withBase("/mindmap.svg")}>Download the SVG</a>.
          </figcaption>
        </figure>
      </main>
      <SiteFooter />
    </div>
  );
}
