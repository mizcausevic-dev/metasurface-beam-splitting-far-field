import { chapterAt, type ChapterId } from "./timeline";

export const STAGE_W = 1280;
export const STAGE_H = 720;

const BG = "#0B1019";
const MAT = "#344257";
const MAT_DARK = "#243244";
const MAT_TOP = "#51627A";
const CYAN = "#00E5FF";
const GOLD = "#FFD166";
const VIOLET = "#9D4EDD";
const BONE = "#E7EEF6";
const MUTED = "#93A0B5";
const GRID = "rgba(231,238,246,0.05)";

type Ctx = CanvasRenderingContext2D;

export type SceneFonts = {
  sans: string;
  mono: string;
  compact: boolean;
};

type Camera = { z: number; x: number; y: number };

type PillarSpec = { len: number; wid: number; rot: number };

const DRAWN_PILLARS: PillarSpec[] = [
  { len: 54, wid: 24, rot: -32 },
  { len: 48, wid: 28, rot: -16 },
  { len: 40, wid: 30, rot: -4 },
  { len: 34, wid: 34, rot: 10 },
  { len: 30, wid: 40, rot: 24 },
  { len: 26, wid: 46, rot: 38 },
];

export function renderScene(
  ctx: Ctx,
  frame: number,
  width: number,
  height: number,
  dpr: number,
  fonts: SceneFonts,
): void {
  const f = Math.max(0, Math.min(1019, frame));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, width, height);

  const scale = Math.min(width / STAGE_W, height / STAGE_H);
  const ox = (width - STAGE_W * scale) / 2;
  const oy = (height - STAGE_H * scale) / 2;
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);

  drawBackdrop(ctx);
  const view = viewAt(f);
  const cam = cameraFor(f, view);

  ctx.save();
  ctx.translate(STAGE_W / 2, STAGE_H / 2);
  ctx.scale(cam.z, cam.z);
  ctx.translate(-STAGE_W / 2 + cam.x, -STAGE_H / 2 + cam.y);

  if (view === "aperture") drawAssembly(ctx, f, fonts);
  if (view === "phase") drawSection(ctx, f, fonts);
  if (view === "propagate") drawPropagate(ctx, f, fonts);
  if (view === "lobes") drawFar(ctx, f, fonts, "rcp");
  if (view === "compare") drawCompare(ctx, f, fonts);

  ctx.restore();

  const curtain = curtainAlpha(f);
  if (curtain > 0) {
    ctx.fillStyle = `rgba(11,16,25,${curtain})`;
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    if (curtain > 0.45) {
      hudLabel(ctx, fonts, 480, 348, "Viewpoint change", MUTED);
    }
  }

  drawHud(ctx, f, view, fonts);
}

function viewAt(frame: number): ChapterId {
  return chapterAt(frame).id;
}

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function smooth(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function cameraFor(frame: number, view: ChapterId): Camera {
  if (view === "aperture") {
    const t = smooth((frame - 36) / 110);
    return { z: lerp(0.9, 1.22, t), x: lerp(48, -24, t), y: lerp(6, 14, t) };
  }
  if (view === "phase") {
    const t = smooth((frame - 150) / 70);
    return { z: lerp(1.0, 1.06, t), x: lerp(8, -6, t), y: lerp(4, 0, t) };
  }
  if (view === "propagate") {
    const t = smooth((frame - 300) / 160);
    return { z: lerp(1.0, 1.1, t), x: lerp(36, -28, t), y: 0 };
  }
  if (view === "lobes") {
    const t = smooth((frame - 510) / 140);
    return { z: lerp(1, 1.02, t), x: lerp(0, -8, t), y: 0 };
  }
  const t = smooth((frame - 960) / 59);
  return { z: lerp(1, 0.9, t), x: 0, y: 0 };
}

function curtainAlpha(frame: number): number {
  const cuts = [150, 300, 510, 750];
  let peak = 0;
  for (const cut of cuts) {
    const d = Math.abs(frame - cut);
    if (d < 9) peak = Math.max(peak, 1 - d / 9);
  }
  return peak;
}

function motionPhase(frame: number, origin: number): number {
  const frozen = Math.min(frame, 990);
  return (frozen - origin) * 0.85;
}

function drawBackdrop(ctx: Ctx): void {
  ctx.save();
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  for (let x = 40; x < STAGE_W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, STAGE_H);
    ctx.stroke();
  }
  for (let y = 40; y < STAGE_H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(STAGE_W, y);
    ctx.stroke();
  }
  ctx.restore();
}

function project(x: number, y: number, z: number): [number, number] {
  return [640 + (x - y) * 0.9, 470 + (x + y) * 0.46 - z];
}

function drawAssembly(ctx: Ctx, frame: number, fonts: SceneFonts): void {
  const reveal = smooth(frame / 28);
  ctx.save();
  ctx.globalAlpha = reveal;
  drawSlab(ctx);
  drawPillarField(ctx);
  ctx.restore();

  if (frame > 24) {
    const beamAlpha = smooth((frame - 24) / 30);
    drawIncomingIso(ctx, frame, beamAlpha);
  }

  if (frame > 70) {
    const a = smooth((frame - 70) / 24);
    ctx.save();
    ctx.globalAlpha = a;
    strokeAperture(ctx);
    ctx.restore();
  }

  if (frame > 18) callout(ctx, fonts, 250, 250, 430, 390, "Silica substrate", BONE);
  if (frame > 48) callout(ctx, fonts, 860, 210, 700, 340, "Dielectric meta-atoms", BONE);
  if (frame > 78) callout(ctx, fonts, 180, 560, 360, 430, "Incident circular polarization", CYAN);
  if (frame > 108) callout(ctx, fonts, 980, 560, 760, 400, "Aperture", CYAN);
}

function drawSlab(ctx: Ctx): void {
  const top = [
    project(-250, -130, 0),
    project(250, -130, 0),
    project(250, 130, 0),
    project(-250, 130, 0),
  ];
  const bot = [
    project(-250, -130, -26),
    project(250, -130, -26),
    project(250, 130, -26),
    project(-250, 130, -26),
  ];
  const quads: [number, number][][] = [
    [bot[0], bot[1], top[1], top[0]],
    [bot[1], bot[2], top[2], top[1]],
    [bot[2], bot[3], top[3], top[2]],
    [bot[3], bot[0], top[0], top[3]],
  ];
  quads.forEach((q, i) => {
    path(ctx, q);
    ctx.fillStyle = i % 2 === 0 ? "#1C2836" : "#243244";
    ctx.fill();
  });
  path(ctx, top);
  const grad = ctx.createLinearGradient(top[0][0], top[0][1], top[2][0], top[2][1]);
  grad.addColorStop(0, "#2A3A4C");
  grad.addColorStop(1, "#1A2430");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = "rgba(231,238,246,0.28)";
  ctx.lineWidth = 1.25;
  ctx.stroke();
}

function drawPillarField(ctx: Ctx): void {
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const x = -180 + col * 46;
      const y = -78 + row * 50;
      const rot = ((col - 4) * 11 + row * 6) * (Math.PI / 180);
      const len = 15 + (col % 4) * 2.4;
      const wid = 9 + ((col + row) % 3) * 2.2;
      isoPillar(ctx, x, y, rot, len, wid, 34);
    }
  }
}

function isoPillar(
  ctx: Ctx,
  x: number,
  y: number,
  rot: number,
  len: number,
  wid: number,
  height: number,
): void {
  const c = Math.cos(rot);
  const s = Math.sin(rot);
  const local: [number, number][] = [
    [-len / 2, -wid / 2],
    [len / 2, -wid / 2],
    [len / 2, wid / 2],
    [-len / 2, wid / 2],
  ].map(([px, py]) => [x + px * c - py * s, y + px * s + py * c]);
  const top = local.map(([px, py]) => project(px, py, height));
  const bot = local.map(([px, py]) => project(px, py, 0));
  const order = [0, 1, 2, 3]
    .map((i) => ({ i, depth: bot[i][1] + bot[(i + 1) % 4][1] }))
    .sort((a, b) => a.depth - b.depth);
  for (const face of order) {
    const i = face.i;
    const j = (i + 1) % 4;
    path(ctx, [bot[i], bot[j], top[j], top[i]]);
    ctx.fillStyle = i % 2 === 0 ? MAT_DARK : MAT;
    ctx.fill();
  }
  path(ctx, top);
  ctx.fillStyle = MAT_TOP;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,209,102,0.45)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawIncomingIso(ctx: Ctx, frame: number, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 1.6;
  const shift = motionPhase(frame, 0) % 26;
  for (let k = 0; k < 6; k += 1) {
    const x0 = -460 + k * 26 + shift;
    ctx.beginPath();
    for (let t = -90; t <= 90; t += 12) {
      const [sx, sy] = project(x0, t, 46);
      if (t === -90) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.globalAlpha = alpha * (0.25 + k * 0.1);
    ctx.stroke();
  }
  ctx.restore();
}

function strokeAperture(ctx: Ctx): void {
  const corners = [
    project(-200, -100, 36),
    project(210, -100, 36),
    project(210, 110, 36),
    project(-200, 110, 36),
  ];
  path(ctx, corners);
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawSection(ctx: Ctx, frame: number, fonts: SceneFonts): void {
  const enter = smooth((frame - 150) / 18);
  ctx.save();
  ctx.globalAlpha = enter;

  ctx.font = `600 22px ${fonts.sans}`;
  ctx.fillStyle = BONE;
  ctx.fillText("Section through the active row", 86, 78);
  ctx.font = `13px ${fonts.mono}`;
  ctx.fillStyle = MUTED;
  ctx.fillText("Plan above. Elevation below. Only the parts this mechanism uses.", 86, 102);

  DRAWN_PILLARS.forEach((pillar, i) => {
    const cx = 180 + i * 170;
    drawPlanPillar(ctx, cx, 210, pillar, fonts, frame > 168 + i * 6);
  });

  ctx.fillStyle = MAT_DARK;
  roundRect(ctx, 120, 390, 1040, 18, 2);
  ctx.fill();
  ctx.font = `12px ${fonts.mono}`;
  ctx.fillStyle = MUTED;
  ctx.fillText("Substrate. Elevation heights are drawn equal. Table 3 does not list pillar height.", 120, 432);

  DRAWN_PILLARS.forEach((pillar, i) => {
    const cx = 180 + i * 170;
    const bw = 18 + pillar.len * 0.35;
    ctx.fillStyle = MAT;
    roundRect(ctx, cx - bw / 2, 408 - 70, bw, 70, 2);
    ctx.fill();
    ctx.fillStyle = MAT_TOP;
    ctx.fillRect(cx - bw / 2, 338, bw, 6);
  });

  drawPhasePlot(ctx, fonts);
  ctx.restore();
}

function drawPlanPillar(
  ctx: Ctx,
  cx: number,
  cy: number,
  pillar: PillarSpec,
  fonts: SceneFonts,
  showTag: boolean,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((pillar.rot * Math.PI) / 180);
  ctx.fillStyle = MAT;
  roundRect(ctx, -pillar.len / 2, -pillar.wid / 2, pillar.len, pillar.wid, 4);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-pillar.len / 2 + 6, 0);
  ctx.lineTo(pillar.len / 2 - 6, 0);
  ctx.strokeStyle = "rgba(255,209,102,0.8)";
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = VIOLET;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, 46, -Math.PI / 2, (-90 + pillar.rot) * (Math.PI / 180), pillar.rot < 0);
  ctx.stroke();
  ctx.restore();

  if (showTag) {
    ctx.font = `12px ${fonts.mono}`;
    ctx.fillStyle = VIOLET;
    ctx.fillText(`\u03b1 ${pillar.rot}\u00b0`, cx - 28, cy + 74);
  }
}
