export const FPS = 30;
export const FRAME_COUNT = 1020;
export const LAST_FRAME = FRAME_COUNT - 1;
export const DURATION_S = FRAME_COUNT / FPS;

export type ChapterId = "aperture" | "phase" | "propagate" | "lobes" | "compare";

export type Chapter = {
  id: ChapterId;
  start: number;
  end: number;
  title: string;
  clock: string;
  narration: string;
};

export const CHAPTERS: readonly Chapter[] = [
  {
    id: "aperture",
    start: 0,
    end: 149,
    title: "Input and aperture",
    clock: "0.000–4.967 s",
    narration:
      "A dielectric pillar array sits on a substrate. A circularly polarized field arrives at the aperture. This beat establishes the assembly. It does not yet claim a far-field result. The push-in is a scale change.",
  },
  {
    id: "phase",
    start: 150,
    end: 299,
    title: "Designed spatial phase",
    clock: "5.000–9.967 s",
    narration:
      "Each drawn pillar has a cross-section and an in-plane rotation. Propagation phase follows the cross-section. Geometric phase follows the rotation, and the sign flips with circular handedness. The traces are a mathematical diagram on these drawn pillars, not the paper’s layout and not a measured phase map.",
  },
  {
    id: "propagate",
    start: 300,
    end: 509,
    title: "Propagation pathway",
    clock: "10.000–16.967 s",
    narration:
      "The transmitted aperture field is what the far field sorts by direction. Cyan marks that transport. Gold marks the designed phase. Violet marks handedness, kept off the power path. Wavefronts are a schematic under time compression, not a computed field.",
  },
  {
    id: "lobes",
    start: 510,
    end: 749,
    title: "Lobes and leakage",
    clock: "17.000–24.967 s",
    narration:
      "Desired lobes are the pair this handedness was summarized as producing. Other transmitted orders, reflection, unconverted polarization, and absorption stay in the accounting. Their weights are not computed here, and they are not drawn as zero.",
  },
  {
    id: "compare",
    start: 750,
    end: 1019,
    title: "Handedness and limits",
    clock: "25.000–34.000 s",
    narration:
      "Design 1, as summarized in a 2022 review of the numerical paper, places RCP at ±19° and LCP at ±42°. The player crossfades those two reported states. It does not sweep intermediate ellipticity. The closing frame holds both states, the open power accounts, and the uncertainty.",
  },
] as const;

export function chapterAt(frame: number): Chapter {
  const f = clampFrame(frame);
  for (const chapter of CHAPTERS) {
    if (f >= chapter.start && f <= chapter.end) return chapter;
  }
  return CHAPTERS[CHAPTERS.length - 1];
}

export function clampFrame(frame: number): number {
  if (!Number.isFinite(frame)) return 0;
  return Math.max(0, Math.min(LAST_FRAME, Math.round(frame)));
}

export function frameTime(frame: number): number {
  return clampFrame(frame) / FPS;
}

export function formatSeconds(seconds: number): string {
  return seconds.toFixed(3);
}
