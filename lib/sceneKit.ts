export const STAGE_W = 1280;
export const STAGE_H = 720;

export const BG = "#0B1019";
export const MAT = "#344257";
export const MAT_DARK = "#243244";
export const MAT_TOP = "#51627A";
export const CYAN = "#00E5FF";
export const GOLD = "#FFD166";
export const VIOLET = "#9D4EDD";
export const BONE = "#E7EEF6";
export const MUTED = "#93A0B5";
export const GRID = "rgba(231,238,246,0.05)";

export type Ctx = CanvasRenderingContext2D;

export type SceneFonts = {
  sans: string;
  mono: string;
  compact: boolean;
};

export type Camera = { z: number; x: number; y: number };

export type PillarSpec = { len: number; wid: number; rot: number };

export const DRAWN_PILLARS: PillarSpec[] = [
  { len: 54, wid: 24, rot: -32 },
  { len: 48, wid: 28, rot: -16 },
  { len: 40, wid: 30, rot: -4 },
  { len: 34, wid: 34, rot: 10 },
  { len: 30, wid: 40, rot: 24 },
  { len: 26, wid: 46, rot: 38 },
];

export function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

export function smooth(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function motionPhase(frame: number, origin: number): number {
  const frozen = Math.min(frame, 990);
  return (frozen - origin) * 0.85;
}

export function project(x: number, y: number, z: number): [number, number] {
  return [640 + (x - y) * 0.9, 470 + (x + y) * 0.46 - z];
}

export function path(ctx: Ctx, pts: [number, number][]): void {
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.closePath();
}

export function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function roundPanel(ctx: Ctx, x: number, y: number, w: number, h: number): void {
  ctx.save();
  ctx.fillStyle = "rgba(20,28,40,0.92)";
  ctx.strokeStyle = "rgba(231,238,246,0.16)";
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function wrapFill(
  ctx: Ctx,
  mono: string,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
): number {
  ctx.font = `12px ${mono}`;
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}

export function hudLabel(ctx: Ctx, fonts: SceneFonts, x: number, y: number, text: string, color: string): number {
  ctx.save();
  const size = fonts.compact ? 15 : 12;
  ctx.font = `${size}px ${fonts.mono}`;
  const w = ctx.measureText(text).width + 16;
  ctx.fillStyle = "rgba(11,16,25,0.88)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, 22, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillText(text, x + 8, y + 15);
  ctx.restore();
  return w;
}

export function callout(
  ctx: Ctx,
  fonts: SceneFonts,
  x: number,
  y: number,
  tx: number,
  ty: number,
  text: string,
  color: string,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + 16);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(tx, ty, 3, 0, Math.PI * 2);
  ctx.fill();
  hudLabel(ctx, fonts, x, y, text, color);
  ctx.restore();
}

export function marker(ctx: Ctx, fonts: SceneFonts, x: number, y: number, n: string, text: string, color: string): void {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BG;
  ctx.font = `700 12px ${fonts.mono}`;
  ctx.fillText(n, x - 4, y + 4);
  ctx.font = `13px ${fonts.mono}`;
  ctx.fillStyle = color;
  ctx.fillText(text, x + 18, y + 4);
  ctx.restore();
}
