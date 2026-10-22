import { chapterAt, type ChapterId } from "./timeline";
import {
  BG, GRID, MUTED, STAGE_H, STAGE_W,
  hudLabel, smooth, lerp,
  type Camera, type Ctx, type SceneFonts,
} from "./sceneKit";
import { drawAssembly, drawSection } from "./sceneAperture";
import { drawCompare, drawFar, drawHud, drawPropagate } from "./sceneField";

export { STAGE_W, STAGE_H } from "./sceneKit";
export type { SceneFonts } from "./sceneKit";

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
