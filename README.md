# Metasurface beam-splitting far field

A 34-second, 1,020-frame schematic of a spin-tunable dielectric metasurface beam splitter. The player keeps the transmitted field, the designed phase, and the polarization control visually separate, and it refuses to draw unwanted orders as zero.

This is an illustration of the architecture in Khalid, Feng, Khan, Yuan, and Somekh, Optics Express 30, 13459–13468 (2022), doi:10.1364/OE.453505. Angles, the 780 nm wavelength, and the 400 by 400 nm unit footprint are taken from Shen and Huang, Nanomanufacturing 2022, 2, 194–228, and labeled as that secondary summary. The canvas does not recompute a field.

## Run locally

```bash
npm install
npm run dev
```

The dev server listens on port 4317. `npm run test:timeline` checks that the five chapters cover frames 0–1019 at 30 fps. `npm run build` writes a static export to `out/`.

GitHub Pages builds with `GITHUB_PAGES=1`, which sets the base path to `/metasurface-beam-splitting-far-field`.

## Pages

- `/` player
- `/article/` the full essay, also in `content/medium-article-Cursor.md`
- `/diagram/` causal diagram
- `/mindmap/` evidence-graded mindmap

## About

Frame-accurate schematic of spin-tunable dielectric metasurface beam splitting and the far-field lobes it does not fully clean up.

## Topics

metasurface, nanophotonics, beam-splitter, optics, far-field, polarization, scientific-visualization, photonics, dielectric-metasurface, fourier-optics

## Evidence boundary

- Abstract: primary, retrieved 22 October 2026.
- Full Optica text: not re-read in the session that built this page. A bot check blocked the HTML.
- Design-1 angles, wavelength, unit footprint, silicon-on-silica description, and the design-2 prose: Shen and Huang’s review.
- Phase traces in the player: a diagram convention applied to drawn pillars, not the paper’s layout.
- Wavefronts and lobe widths: schematic. Time compression and scale changes are labeled on the canvas.

The seven-theme dashboard switcher from the studio default is not used. This brief locks one technical palette.

## Repurpose

The clock, the three overlay colors, and the rule against unlabeled decibels transfer to any wave device whose honest picture is a local transformer, a propagation step, and a far-field spectrum that still has sidelobes: gratings, acoustic metasurfaces, phased arrays.
