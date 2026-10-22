"use client";

import { useEffect, useRef, useState } from "react";
import { renderScene } from "@/lib/renderScene";
import {
  CHAPTERS,
  FPS,
  LAST_FRAME,
  chapterAt,
  clampFrame,
  formatSeconds,
  frameTime,
} from "@/lib/timeline";

export function Player() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const playingRef = useRef(false);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fonts, setFonts] = useState({ sans: "Space Grotesk, sans-serif", mono: "JetBrains Mono, ui-monospace, monospace" });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(media.matches);
      if (!media.matches) {
        playingRef.current = true;
        setPlaying(true);
      }
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const read = () => {
      const probe = document.createElement("span");
      probe.style.fontFamily = "var(--font-mono), ui-monospace, monospace";
      probe.style.position = "absolute";
      probe.style.left = "-9999px";
      document.body.appendChild(probe);
      const monoFamily = getComputedStyle(probe).fontFamily;
      probe.remove();
      setFonts({
        sans: getComputedStyle(document.body).fontFamily || "sans-serif",
        mono: monoFamily || "ui-monospace, monospace",
      });
    };
    read();
    void document.fonts?.ready.then(read);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = () => {
      const cssW = canvas.clientWidth || 960;
      const cssH = Math.round((cssW * 720) / 1280);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
      }
      renderScene(ctx, frameRef.current, cssW, cssH, dpr, {
        sans: fonts.sans,
        mono: fonts.mono,
        compact: cssW < 760,
      });
    };

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dt = Math.min(80, now - last);
      last = now;
      if (playingRef.current) {
        acc += dt;
        const step = 1000 / FPS;
        let moved = false;
        while (acc >= step) {
          acc -= step;
          if (frameRef.current >= LAST_FRAME) {
            playingRef.current = false;
            setPlaying(false);
            break;
          }
          frameRef.current += 1;
          moved = true;
        }
        if (moved) setFrame(frameRef.current);
      }
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [fonts.mono, fonts.sans]);

  const actions = useRef({
    toggle: () => {},
    step: (delta: number) => {
      void delta;
    },
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.code === "Space") {
        event.preventDefault();
        actions.current.toggle();
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        actions.current.step(1);
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        actions.current.step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function commit(next: number, keepPlaying = playingRef.current) {
    const value = clampFrame(next);
    frameRef.current = value;
    setFrame(value);
    if (value >= LAST_FRAME) {
      playingRef.current = false;
      setPlaying(false);
      return;
    }
    playingRef.current = keepPlaying;
    setPlaying(keepPlaying);
  }

  function toggle() {
    if (frameRef.current >= LAST_FRAME) {
      commit(0, true);
      return;
    }
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  }

  function step(delta: number) {
    commit(frameRef.current + delta, false);
  }

  actions.current.toggle = toggle;
  actions.current.step = step;

  const chapter = chapterAt(frame);
  const seconds = frameTime(frame);

  return (
    <section className="stage" aria-label="Metasurface beam-splitting player">
      <canvas ref={canvasRef} role="img" aria-label={chapter.narration} />
      <div className="controls">
        <div className="transport">
          <button className="btn" type="button" onClick={toggle} aria-pressed={playing}>
            {playing ? "Pause" : frame >= LAST_FRAME ? "Replay" : "Play"}
          </button>
          <button className="btn" type="button" onClick={() => step(-1)}>
            Frame back
          </button>
          <button className="btn" type="button" onClick={() => step(1)}>
            Frame forward
          </button>
          <button className="btn" type="button" onClick={() => commit(LAST_FRAME, false)}>
            Ending overview
          </button>
          <div className="clock">
            Frame {String(frame).padStart(4, "0")} / {LAST_FRAME} · {formatSeconds(seconds)} s
            {frame === LAST_FRAME ? " held through 34.000 s" : ""} · {FPS} fps
          </div>
        </div>
        <input
          className="scrubber"
          type="range"
          min={0}
          max={LAST_FRAME}
          value={frame}
          aria-valuetext={`${chapter.title}, ${formatSeconds(seconds)} seconds`}
          onChange={(event) => commit(Number(event.target.value), false)}
        />
        <div className="chapters">
          {CHAPTERS.map((item) => (
            <button
              key={item.id}
              className="btn"
              type="button"
              aria-pressed={chapter.id === item.id}
              onClick={() => commit(item.start, true)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="readout">
          <div>
            <p className="eyebrow">{chapter.clock}</p>
            <h2>{chapter.title}</h2>
            <p aria-live="polite">{chapter.narration}</p>
            {reduced ? (
              <p style={{ marginTop: 8 }}>
                Reduced motion is on, so playback stays stopped until you press Play. Wavefronts advance only while the clock runs.
              </p>
            ) : null}
          </div>
          <div className="legend" aria-label="Color key">
            <div className="swatch">
              <i style={{ background: "#00E5FF" }} />
              Cyan: transport, the field being followed
            </div>
            <div className="swatch">
              <i style={{ background: "#FFD166" }} />
              Gold: designed phase, the local actuator
            </div>
            <div className="swatch">
              <i style={{ background: "#9D4EDD" }} />
              Violet: control state, handedness and rotation
            </div>
            <div className="swatch">
              <i style={{ background: "#344257" }} />
              Neutral: dielectric material, not an emission
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
