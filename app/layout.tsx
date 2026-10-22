import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const description =
  "A 34-second, 1,020-frame schematic of how an all-dielectric metasurface splits circularly polarized light, why the opposite handedness changes the angles, and why unwanted orders do not vanish.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Metasurface beam-splitting far field",
    template: "%s · Metasurface beam-splitting far field",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Metasurface beam-splitting far field",
    description,
    type: "article",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/hero-two-lobe-metasurface.svg`, width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metasurface beam-splitting far field",
    description,
    images: [`${SITE_URL}/hero-two-lobe-metasurface.svg`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Metasurface beam-splitting far field",
  description,
  learningResourceType: "Interactive schematic",
  educationalLevel: "Advanced",
  teaches:
    "How propagation phase and geometric phase in a dielectric metasurface split a circularly polarized beam, and why the far field still contains leakage.",
  url: SITE_URL,
  isBasedOn: "https://doi.org/10.1364/OE.453505",
  creator: {
    "@type": "Organization",
    name: "Kinetic Gain LLC",
    url: "https://kineticgain.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Kinetic Gain LLC",
    url: "https://kineticgain.com",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
