import { Player } from "@/components/Player";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { CHAPTERS } from "@/lib/timeline";
import { withBase } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="shell">
      <SiteHeader />
      <main>
        <p className="prose" style={{ paddingBottom: 0 }}>
          A frame-locked schematic of a spin-tunable dielectric beam splitter. 34 seconds, 30 frames per second, frames 0 through 1019.
          Cyan follows the field, gold marks the designed phase, violet marks handedness. Nothing on the canvas is a computed intensity map.
        </p>
        <Player />
        <figure className="hero-fig">
          {/* Public SVG. next/image dropped the GitHub Pages base path on the preload. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/hero-two-lobe-metasurface.svg")}
            alt="Illustrative schematic of rectangular dielectric pillars on a substrate, a cyan input, two transmitted lobes, and dimmer leakage rays."
            width={1280}
            height={720}
          />
          <figcaption>
            Illustrative still, not a micrograph and not a computed field. Rectangular pillars, a handedness mark, phase ticks, two transmitted lobes, and dimmer leakage.
            The split is drawn partway along the row so both beams fit the frame. In the player the aperture is one transmitting plane.
          </figcaption>
        </figure>
        <section className="prose" style={{ paddingTop: 28 }}>
          <h2>What the clock is doing</h2>
          <div className="facts">
            {CHAPTERS.map((chapter) => (
              <article className="fact" key={chapter.id}>
                <span>
                  Frames {chapter.start}–{chapter.end}
                </span>
                <p>
                  <strong>{chapter.title}.</strong> {chapter.narration}
                </p>
              </article>
            ))}
          </div>
          <h2>What this is</h2>
          <div className="grid-2">
            <div>
              <p>
                The reference is Khalid, Feng, Khan, Yuan, and Somekh, “All-dielectric metasurface designs for spin-tunable beam splitting via simultaneous manipulation of propagation and geometric phases,” Optics Express 30, 13459–13468 (2022). The abstract says they propose and numerically realize a splitter that sends a circularly polarized beam into two directions and moves those directions by switching handedness.
              </p>
              <p>
                Shen and Huang’s 2022 review summarizes one design as silicon nanopillars on silica, a 400 by 400 nm unit at 780 nm, and simulated angles of ±19° for RCP and ±42° for LCP. Those angles are drawn as cited directions. This page does not recompute them, and it does not close an efficiency budget.
              </p>
            </div>
            <div>
              <p>
                Read the full essay for the phase convention, the open power accounts, and the sentences this page will not say. The diagram and the mindmap are the same mechanism without the clock.
              </p>
              <p>
                <a href={withBase("/article/")}>Full article</a>
                {" · "}
                <a href={withBase("/diagram/")}>Causal diagram</a>
                {" · "}
                <a href={withBase("/mindmap/")}>Mindmap</a>
                {" · "}
                <a href="https://doi.org/10.1364/OE.453505">Paper DOI</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
