# Spin-tunable dielectric beam splitting, and the far field that still leaks

A dielectric metasurface can take one circularly polarized beam and send it out along two transmitted directions. Flip the handedness and, in the architecture this essay is about, those directions move. The far field is not a pair of perfect rays. It is an angular spectrum: the directions the phase profile was built to feed, plus every other order the aperture still supports.

This is a reading of that mechanism, written to sit next to a 34-second schematic. The schematic is original illustration. The mechanism is not. The clock, the cutaways, and the colors were chosen so a viewer can keep transport, phase, and control state apart. They are not frames from an experiment.

## What the reference actually supports

The paper is Ata Ur Rahman Khalid, Fu Feng, Muhammad Ismail Khan, Xiaocong Yuan, and Michael Geoffrey Somekh, “All-dielectric metasurface designs for spin-tunable beam splitting via simultaneous manipulation of propagation and geometric phases,” Optics Express, volume 30, pages 13459 to 13468, published 15 March 2022. The DOI is [10.1364/OE.453505](https://doi.org/10.1364/OE.453505).

The publisher abstract, read on 22 October 2026 through the Semantic Scholar graph API, says the authors propose and numerically realize a metasurface beam splitter that splits an incoming circularly polarized beam into two directions and tunes the splitting angles by switching the handedness of the incident polarization. The abstract names optical communication, multiplexing, and imaging as potential uses. That is the authors’ statement of potential. It is not evidence that a link, a camera, or a catalog part uses this layout.

The Optica HTML returned a bot check during this writing session, so the full text was not re-read here. Details that are not in the abstract are taken from a secondary source and labeled as such: Zhe Shen and Dingxin Huang, “A Review on Metasurface Beam Splitters,” Nanomanufacturing 2022, volume 2, pages 194 to 228, DOI [10.3390/nanomanufacturing2040014](https://doi.org/10.3390/nanomanufacturing2040014).

Shen and Huang describe silicon nanopillars on a silica substrate and two designs. Their Table 3 lists this work as silicon, a 400 by 400 nanometer unit, a working wavelength of 780 nanometers, splitting angles of ±19° for right-circular polarization and ±42° for left-circular polarization, and a research type of simulation. The table cell does not list pillar height. Their prose adds a second design: right-circular input still at ±19°, while left-circular input puts both beams on the same side of the surface normal, at −26° and −19°. None of those angles were recomputed for this page.

## Two phases, one aperture

The title tells you the design move. A propagation phase and a geometric phase are set at the same time, so the phase profile one circular handedness sees is not the profile the other handedness sees.

In this class of dielectric meta-atom the propagation phase comes from the cross-section. An anisotropic pillar, longer on one in-plane axis than the other, presents a different optical path to the two linear components of the field. Changing that footprint changes the delay. The geometric phase, the Pancharatnam-Berry term, comes from rotating that pillar in the plane by an angle α. For the circular component the pillar converts, the standard sign structure flips with handedness: one spin picks up about +2α, the other about −2α, on top of the propagation phase.

This page draws that relation as a diagram convention, not as a transcription of the paper’s equation numbers:

`φ₊ = φ_prop + 2α`

`φ₋ = φ_prop − 2α`

The sign choice belongs to the drawing. What the title and the abstract support is the joint use of both phases so that handedness changes the split. The pillars in the sectional close-up are a teaching row. They are not a claim about the paper’s rotation schedule, and the phase plot under them is the convention applied to those drawn pillars. It is a mathematical diagram. It is not the profile that produces ±19° or ±42°.

Gold marks the propagation phase because that delay is the local actuator of the wavefront. Violet marks rotation and handedness because those are control state. Cyan marks the field that actually leaves. The colors are overlays. The pillars are not emitters, and the gold ticks are not a metal coating.

## The far field is the angular spectrum

After the pillars stamp a complex transmission onto the incident field, the object that propagates is the aperture field. In the far field, direction and transverse wave number are Fourier partners. Energy in a transverse spatial frequency shows up at the matching angle. A phase profile whose dominant spatial frequencies sit at two places sends light toward two directions. That is the beam splitter, stated as a Fourier fact, not as a fit to one device.

A single linear phase ramp steers one beam. A profile built as the sum of two ramps, or a supercell whose diffraction peaks in two orders, divides one beam into two. Discretizing that profile into finite pillars, on a finite aperture, with imperfect conversion into the designed polarization, feeds spatial frequencies the ideal ramp does not contain. Those extra frequencies are the other orders.

The player therefore draws desired lobes and, separately, leakage. Leakage here means other transmitted orders, the reflection and the unconverted polarization that never joined the designed path, and absorption in a real dielectric. “Dielectric” is a reason to expect lower ohmic loss than a plasmonic metal. It is not a measurement of zero loss. No efficiency is printed on this page, because this page did not compute one and did not copy one out of a figure it could not open.

The quantity to balance is energy. The optical field in the schematic is not a net charge current, and it is not a mass-carrying particle beam. Power that arrives at the aperture leaves in transmission, reflection, or absorption. The drawing keeps those accounts open on purpose. A bar chart with invented percentages would look like a result. It would be fiction. The inset is a checklist.

## Handedness is the comparison

Polarization independence is the wrong headline for this architecture. The point of the design is that the angles change when the incident circular polarization flips. Many other metasurface splitters are built the opposite way, with symmetric meta-atoms, so the split does not care about polarization. Citing one of those and this one in the same breath, as if “metasurface beam splitter” were a single specification, hides the mechanism.

The comparison the player holds at the end is design 1, as Shen and Huang summarize it:

- Right-circular input: ±19°.
- Left-circular input: ±42°.

Both pairs are labeled as reported simulated angles for that design. They are not a goniometer scan, and they are not a fresh electromagnetic run. Design 2 is named in the closing frame and is not drawn. A one-sentence paraphrase is enough to know the left-circular pair sits on one side of the normal. It is not enough to invent the aperture that produces it.

The player does not slide the lobes through the angles in between. A continuous morph would imply that intermediate elliptical inputs were characterized. They were not, in any source used here. The sequence crossfades from one reported state to the other, and the caption says so.

## How to watch the 34 seconds

The clock is 30 frames per second. Frame 0 is the start. Frame 1019 is the last index. The held length of 1,020 frames is 34.000 seconds. Frame 1019 is on screen through the final interval.

Nothing in the scene is real-time optics. At a cited wavelength of 780 nanometers, an optical cycle is a few femtoseconds. Moving wavefronts are time-compressed. When they drift slowly across a beat, the canvas also says slow motion. When the camera pushes in, the canvas says the scale changed. Meta-atoms and the far-field arc are never drawn in one physical scale.

- Frames 0 to 149. Substrate, pillar array, incident field, aperture. Then a measured push toward the active region.
- Frames 150 to 299. Plan and elevation of the meta-atoms the mechanism uses. Cross-section, rotation, the sign flip. No far-field claim yet.
- Frames 300 to 509. Side-view propagation. The causal path is numbered. Violet control stays off the cyan path.
- Frames 510 to 749. Desired lobes separated from leakage for one selected handedness. The inset is qualitative.
- Frames 750 to 1019. The two cited handedness states, then a pullback that stops. Losses and uncertainty remain. The last frames are stable.

Those cuts are a teaching order. They are not a claim about how the authors paced their figures.

## What this essay will not say

It will not say unwanted orders are extinguished. A grating, a metasurface, or a phased array with a finite aperture has a spectrum, and the spectrum has more than the terms you specified unless a calculation shows those other terms are negligible. That calculation is not on this page.

It will not say the splitter is polarization independent. The abstract’s claim is the opposite kind of claim: the angles tune with handedness.

It will not quote an efficiency, a bandwidth, a damage threshold, a fabrication tolerance, or a certification. It will not give laser settings, alignment steps, or etch recipes. A far-field cartoon is not a bench procedure, and this subject does not need one to be understood.

It will not treat 400 by 400 nanometers at 780 nanometers as a full layout. That pair is a unit footprint and a working wavelength from a review table. Pillar height, the rotation schedule, and the propagation-phase library live in the paper’s figures. Those figures were not retrieved in this session. Missing geometry is better than invented geometry.

## Where the same drawing habit transfers

The player is a clock, a three-color overlay rule, and a refusal to label a lobe with a decibel value the author did not compute. That structure fits any wave device whose honest picture has three layers: a local transformer, a propagation step, and a far-field spectrum that must keep its sidelobes. A diffraction grating, an acoustic metasurface, and a phased array can reuse the clock. What changes is the physics in the middle chapter, and the citation glued to every number.

The commercial use of this page is narrow on purpose. It is a public explainer. It does not collect a lead, it does not assert a product, and it does not dress a schematic up as a measured gain. If a later reading of the Optica PDF supplies a simulated efficiency, the right edit is to quote it as simulated, with wavelength and polarization attached, and to leave the schematic labeled as a schematic.

## Questions the picture is built to answer

### Is this a measured device?

The abstract says “numerically realize.” Shen and Huang’s table lists the research type as simulation. This page adds no measurement.

### Why do the two circular inputs not land on the same angles?

Because the geometric-phase term changes sign with handedness while the propagation phase does not. The phase gradient the aperture presents is therefore different, and the far-field angles move with it.

### Why are there extra rays in the drawing?

Because “designed directions” and “everything the aperture radiates” are different sets. The extra rays are a reminder of the second set. Their angles, in the player, are not taken from a published spectrum. Their existence in the accounting is the point.

### Can the same surface ignore polarization?

Not this architecture. A polarization-insensitive splitter is a different design, usually a symmetric meta-atom, and it should be cited as that design. Mixing the two claims is how a datasheet gets ahead of the physics.

## Sources

- Khalid, A. U. R., Feng, F., Khan, M. I., Yuan, X., and Somekh, M. G. All-dielectric metasurface designs for spin-tunable beam splitting via simultaneous manipulation of propagation and geometric phases. Optics Express 30, 13459–13468 (2022). [doi:10.1364/OE.453505](https://doi.org/10.1364/OE.453505). Abstract retrieved 22 October 2026. Full text not re-read in this session.
- Shen, Z., and Huang, D. A Review on Metasurface Beam Splitters. Nanomanufacturing 2022, 2, 194–228. [doi:10.3390/nanomanufacturing2040014](https://doi.org/10.3390/nanomanufacturing2040014). Secondary summary, including Table 3 and the design-2 prose.

The player that accompanies this essay is a static page. It stores nothing, it posts nothing, and it does not run a field solver.
