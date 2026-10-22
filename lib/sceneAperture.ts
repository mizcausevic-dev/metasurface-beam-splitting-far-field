import {
  BONE, CYAN, DRAWN_PILLARS, GOLD, MAT, MAT_DARK, MAT_TOP, MUTED, VIOLET,
  callout, motionPhase, path, project, roundRect, smooth, wrapFill,
  type Ctx, type PillarSpec, type SceneFonts,
} from "./sceneKit";

export function drawAssembly(ctx: Ctx, frame: number, fonts: SceneFonts): void {
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

export function drawSection(ctx: Ctx, frame: number, fonts: SceneFonts): void {
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

function propPhase(pillar: PillarSpec): number {
  const aspect = pillar.len / pillar.wid;
  return (aspect - 1) * 70;
}

function diagramPhase(pillar: PillarSpec, sign: 1 | -1): number {
  return wrap180(propPhase(pillar) + sign * 2 * pillar.rot);
}

function wrap180(deg: number): number {
  let v = deg;
  while (v > 180) v -= 360;
  while (v < -180) v += 360;
  return v;
}

function drawPhasePlot(ctx: Ctx, fonts: SceneFonts): void {
  const x0 = 140;
  const y0 = 640;
  const w = 760;
  const h = 150;
  ctx.strokeStyle = "rgba(231,238,246,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0 - h);
  ctx.lineTo(x0, y0);
  ctx.lineTo(x0 + w, y0);
  ctx.stroke();
  ctx.font = `12px ${fonts.mono}`;
  ctx.fillStyle = MUTED;
  ctx.fillText("+180\u00b0", x0 - 48, y0 - h + 4);
  ctx.fillText("0", x0 - 16, y0 - h / 2);
  ctx.fillText("\u2212180\u00b0", x0 - 52, y0);

  const samples = DRAWN_PILLARS;
  const toX = (i: number) => x0 + ((i + 0.5) / samples.length) * w;
  const toY = (deg: number) => y0 - ((deg + 180) / 360) * h;

  strokeSeries(ctx, samples.map((p, i) => [toX(i), toY(diagramPhase(p, 1))]), GOLD, false);
  strokeSeries(ctx, samples.map((p, i) => [toX(i), toY(diagramPhase(p, -1))]), VIOLET, true);

  ctx.fillStyle = GOLD;
  ctx.fillText("\u03c6\u208a = \u03c6_prop + 2\u03b1", 940, 520);
  ctx.fillStyle = VIOLET;
  ctx.fillText("\u03c6\u208b = \u03c6_prop \u2212 2\u03b1", 940, 544);
  ctx.fillStyle = MUTED;
  wrapFill(
    ctx,
    fonts.mono,
    "Diagram convention for the converted circular component. Vertical scale is one turn. These pillars are not the paper\u2019s layout, and this curve is not the profile behind the cited angles.",
    940,
    572,
    300,
    16,
  );
}

function strokeSeries(ctx: Ctx, pts: [number, number][], color: string, dashed: boolean): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  if (dashed) ctx.setLineDash([6, 5]);
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
  ctx.stroke();
  ctx.setLineDash([]);
  for (const p of pts) {
    ctx.beginPath();
    ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.restore();
}
