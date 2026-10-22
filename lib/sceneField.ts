import {
  BONE, CYAN, GOLD, MAT, MAT_DARK, MAT_TOP, MUTED, VIOLET,
  marker, motionPhase, roundRect, smooth, wrapFill,
  type Ctx, type SceneFonts,
} from "./sceneKit";
import { drawInset, lobe, rayLabel } from "./sceneLate";

export function drawPropagate(ctx: Ctx, frame: number, fonts: SceneFonts): void {
  const enter = smooth((frame - 300) / 16);
  ctx.save();
  ctx.globalAlpha = enter;
  const phase = motionPhase(frame, 300);
  const apertureX = 470;
  const midY = 360;

  ctx.font = `600 22px ${fonts.sans}`;
  ctx.fillStyle = BONE;
  ctx.fillText("Side view. Causal path only.", 64, 64);

  for (let i = 0; i < 8; i += 1) {
    const x = 70 + i * 42 + (phase % 42);
    if (x > apertureX - 30) continue;
    ctx.strokeStyle = CYAN;
    ctx.globalAlpha = enter * 0.85;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, 210);
    ctx.lineTo(x, 510);
    ctx.stroke();
  }
  ctx.globalAlpha = enter;

  ctx.fillStyle = MAT_DARK;
  roundRect(ctx, apertureX - 16, 190, 36, 340, 2);
  ctx.fill();

  for (let i = 0; i < 9; i += 1) {
    const y = 214 + i * 34;
    const bw = 14 + (i % 4) * 4;
    ctx.fillStyle = MAT_TOP;
    roundRect(ctx, apertureX - bw / 2, y, bw, 22, 2);
    ctx.fill();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }

  ctx.beginPath();
  for (let i = 0; i < 9; i += 1) {
    const y = 225 + i * 34;
    const kick = Math.sin(i * 0.9) * 28;
    if (i === 0) ctx.moveTo(apertureX + 28, y);
    ctx.lineTo(apertureX + 28 + kick, y);
  }
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.stroke();

  packet(ctx, apertureX + 20, midY - 20, -19, phase, CYAN, 0.95);
  packet(ctx, apertureX + 20, midY + 20, 19, phase, CYAN, 0.95);
  packet(ctx, apertureX + 20, midY, 0, phase, MUTED, 0.35);
  packet(ctx, apertureX + 20, midY - 10, -56, phase, MUTED, 0.22);

  marker(ctx, fonts, 120, 160, "1", "Incident CP", CYAN);
  marker(ctx, fonts, 430, 150, "2", "Local phase", GOLD);
  marker(ctx, fonts, 430, 560, "3", "Aperture field", CYAN);
  marker(ctx, fonts, 860, 120, "4", "Two directions", CYAN);
  marker(ctx, fonts, 250, 600, "C", "Handedness selects the phase profile", VIOLET);

  ctx.font = `12px ${fonts.mono}`;
  ctx.fillStyle = MUTED;
  ctx.fillText("Near-axis and wide-angle rays are leakage. Angles on those rays are not from a spectrum.", 64, 680);
  ctx.restore();
}

function packet(
  ctx: Ctx,
  x0: number,
  y0: number,
  deg: number,
  phase: number,
  color: string,
  alpha: number,
): void {
  ctx.save();
  ctx.translate(x0, y0);
  ctx.rotate((-deg * Math.PI) / 180);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(430, 0);
  ctx.stroke();
  for (let i = 0; i < 7; i += 1) {
    const x = 36 + i * 56 + (phase % 56);
    if (x > 460) continue;
    ctx.beginPath();
    ctx.moveTo(x, -26);
    ctx.lineTo(x, 26);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawFar(ctx: Ctx, frame: number, fonts: SceneFonts, which: "rcp" | "lcp"): void {
  const enter = which === "rcp" ? smooth((frame - 510) / 16) : 1;
  ctx.save();
  ctx.globalAlpha = enter;
  const ang = which === "rcp" ? 19 : 42;
  farStage(ctx, fonts, ang, which, frame, true);
  ctx.restore();
}

function farStage(
  ctx: Ctx,
  fonts: SceneFonts,
  angle: number,
  which: "rcp" | "lcp",
  frame: number,
  showInset: boolean,
): void {
  const originX = 360;
  const originY = 360;
  ctx.font = `600 22px ${fonts.sans}`;
  ctx.fillStyle = BONE;
  const title =
    which === "rcp"
      ? "Far field, one selected handedness"
      : "Far field after the handedness flip";
  ctx.fillText(title, 64, 108);

  ctx.strokeStyle = "rgba(0,229,255,0.35)";
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.arc(originX, originY, 250, -Math.PI * 0.55, Math.PI * 0.55);
  ctx.stroke();
  ctx.font = `12px ${fonts.mono}`;
  ctx.fillStyle = MUTED;
  ctx.fillText("Observation arc. Radius is not range.", originX + 150, originY - 230);

  ctx.fillStyle = MAT;
  roundRect(ctx, originX - 10, originY - 70, 16, 140, 2);
  ctx.fill();

  lobe(ctx, originX, originY, angle, 7, CYAN, 0.55, 280);
  lobe(ctx, originX, originY, -angle, 7, CYAN, 0.55, 280);
  lobe(ctx, originX, originY, 0, 3.2, MUTED, 0.28, 230);
  lobe(ctx, originX, originY, 58, 3.5, MUTED, 0.18, 200);
  lobe(ctx, originX, originY, -62, 3.2, MUTED, 0.14, 180);

  rayLabel(ctx, fonts, originX, originY, angle, 300, `+${angle}° desired`, CYAN);
  rayLabel(ctx, fonts, originX, originY, -angle, 300, `−${angle}° desired`, CYAN);
  ctx.fillStyle = MUTED;
  ctx.font = `12px ${fonts.mono}`;
  ctx.fillText("Other orders. Positions are not taken from a spectrum.", 700, 168);

  const cited =
    which === "rcp"
      ? "RCP, design 1. \u00b119\u00b0 as summarized for the numerical paper. Not recomputed."
      : "LCP, design 1. \u00b142\u00b0 as summarized for the numerical paper. Not recomputed.";
  ctx.fillStyle = VIOLET;
  wrapFill(ctx, fonts.mono, cited, 700, 80, 500, 16);

  if (showInset) drawInset(ctx, fonts, frame);
}
