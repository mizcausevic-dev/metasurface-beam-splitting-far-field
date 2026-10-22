import Link from "next/link";

const links = [
  ["/", "Player"],
  ["/article/", "Article"],
  ["/diagram/", "Diagram"],
  ["/mindmap/", "Mindmap"],
];

export function SiteHeader({
  title = "Beam-splitting far field",
  as = "h1",
}: {
  title?: string;
  as?: "h1" | "p";
}) {
  const Title = as;
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Metasurface optics</p>
        <Title className={as === "h1" ? undefined : "site-title"}>{title}</Title>
      </div>
      <nav className="nav" aria-label="Primary">
        {links.map(([href, label]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Schematic explainer of the architecture in Khalid et al., Optics Express 30, 13459–13468 (2022), doi:10.1364/OE.453505.
        Angles, wavelength, and unit footprint that are not in the abstract are cited from Shen and Huang, Nanomanufacturing 2022, 2, 194–228.
        Camera moves and timing are original illustration, not experimental observations. No operational instructions for lasers or fabrication.
      </p>
    </footer>
  );
}
