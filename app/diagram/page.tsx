import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { SITE_URL, withBase } from "@/lib/site";

export const metadata: Metadata = {
  title: "Causal diagram",
  description:
    "Labeled causal diagram of a spin-tunable dielectric metasurface beam splitter: incident field, two phases, aperture field, desired lobes, and leakage.",
  alternates: { canonical: `${SITE_URL}/diagram/` },
};

export default function DiagramPage() {
  const svg = fs.readFileSync(path.join(process.cwd(), "public", "diagram.svg"), "utf8");
  return (
    <div className="shell">
      <SiteHeader as="p" title="Causal diagram" />
      <main className="prose">
        <p>
          The power path is solid cyan. Gold is the phase actuator. Dashed violet is control state, and it does not merge into the power path. Desired lobes, other orders, and the unclosed budget are separate boxes so a clean split is not the picture.
        </p>
        <figure className="figure-frame">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
          <figcaption>
            Schematic of the architecture in Khalid et al., Optics Express 2022. The ±19° and ±42° pair is design 1 as summarized by Shen and Huang, not a recomputation.{" "}
            <a href={withBase("/diagram.svg")}>Download the SVG</a>.
          </figcaption>
        </figure>
      </main>
      <SiteFooter />
    </div>
  );
}
