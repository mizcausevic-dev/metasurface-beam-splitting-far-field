function lobe(
  ctx: Ctx,
  x: number,
  y: number,
  deg: number,
  spread: number,
  color: string,
  alpha: number,
  length: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((-deg * Math.PI) / 180);
  const s = Math.tan((spread * Math.PI) / 180) * length;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, -s);
  ctx.lineTo(length, s);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.restore();
}

function rayLabel(
  ctx: Ctx,
  fonts: SceneFonts,
  x: number,
  y: number,
  deg: number,
  radius: number,
  text: string,
  color: string,
): void {
  const rad = (-deg * Math.PI) / 180;
  const lx = x + Math.cos(rad) * radius;
  const ly = y + Math.sin(rad) * radius;
  ctx.font = `12px ${fonts.mono}`;
  ctx.fillStyle = color;
  ctx.fillText(text, lx, ly);
}

function drawInset(ctx: Ctx, fonts: SceneFonts, frame: number): void {
  const open = smooth((frame - 560) / 30);
  ctx.save();
  ctx.globalAlpha = open;
  roundPanel(ctx, 760, 300, 460, 360);
  ctx.font = `600 16px ${fonts.sans}`;
  ctx.fillStyle = BONE;
  ctx.fillText("Open accounts", 784, 332);
  ctx.font = `13px ${fonts.mono}`;
  const rows = [
    ["Desired pair", "Direction cited. Power not computed."],
    ["Other transmitted orders", "Drawn, not extinguished."],
    ["Reflection / unconverted", "Kept in the budget. No fraction."],
    ["Absorption and scatter", "A dielectric is not a zero-loss claim."],
  ];
  rows.forEach((row, i) => {
    const y = 370 + i * 64;
    ctx.fillStyle = i === 0 ? CYAN : i === 1 ? MUTED : GOLD;
    ctx.fillRect(784, y - 12, 8, 28);
    ctx.fillStyle = BONE;
    ctx.fillText(row[0], 804, y);
    ctx.fillStyle = MUTED;
    wrapFill(ctx, fonts.mono, row[1], 804, y + 18, 390, 16);
  });
  ctx.restore();
}

export function drawCompare(ctx: Ctx, frame: number, fonts: SceneFonts): void {
  const enter = smooth((frame - 750) / 16);
  ctx.save();
  ctx.globalAlpha = enter;

  const cross = frame < 840 ? 0 : frame < 880 ? smooth((frame - 840) / 40) : 1;
  const settled = frame >= 960;
  const rcpStrength = settled ? 1 : 1 - cross * 0.6;
  const lcpStrength = settled ? 1 : 0.35 + cross * 0.65;

  ctx.font = `600 22px ${fonts.sans}`;
  ctx.fillStyle = BONE;
  ctx.fillText(settled ? "Stable overview" : "Compare selected polarization inputs", 48, 52);
  ctx.font = `13px ${fonts.mono}`;
  ctx.fillStyle = MUTED;
  ctx.fillText(
    settled
      ? "Both reported states stay visible. Losses and uncertainty stay visible."
      : "Crossfade between two reported states. Not a sweep of elliptical inputs.",
    48,
    76,
  );

  miniAssembly(ctx, fonts);
  stateCard(ctx, fonts, 300, 110, "RCP", 19, CYAN, rcpStrength, settled ? 1 : frame >= 840 ? 0.72 : 1);
  stateCard(ctx, fonts, 640, 110, "LCP", 42, VIOLET, lcpStrength, 1);

  roundPanel(ctx, 980, 110, 260, 250);
  ctx.font = `600 15px ${fonts.sans}`;
  ctx.fillStyle = BONE;
  ctx.fillText("Limits kept", 998, 140);
  ctx.font = `12px ${fonts.mono}`;
  ctx.fillStyle = MUTED;
  wrapFill(
    ctx,
    fonts.mono,
    "Numerical source. This canvas does not recompute the field. No efficiency. No polarization independence. Design 2 is not drawn: the review prose puts LCP at \u221226\u00b0 and \u221219\u00b0, same side of the normal.",
    998,
    164,
    226,
    15,
  );

  roundPanel(ctx, 48, 470, 1192, 210);
  ctx.fillStyle = BONE;
  ctx.font = `600 15px ${fonts.sans}`;
  ctx.fillText("Energy account, unclosed", 68, 500);
  ctx.font = `13px ${fonts.mono}`;
  const items = [
    ["Incident", "Power arrives at the aperture."],
    ["Desired pair", "Two transmitted directions."],
    ["Other orders", "Still present."],
    ["Reflection", "Unconverted light included."],
    ["Absorption", "Not assigned a number."],
  ];
  items.forEach((item, i) => {
    const x = 68 + i * 230;
    ctx.fillStyle = i === 1 ? CYAN : i === 0 ? BONE : GOLD;
    ctx.fillText(item[0], x, 536);
    ctx.fillStyle = MUTED;
    wrapFill(ctx, fonts.mono, item[1], x, 558, 210, 16);
  });
  ctx.fillStyle = MUTED;
  ctx.fillText(
    "Charge: this optical field is not drawn as a net current. Mass: not a particle beam. Scale of the lobes is diagrammatic.",
    68,
    640,
  );
  ctx.restore();
}

function miniAssembly(ctx: Ctx, fonts: SceneFonts): void {
  roundPanel(ctx, 48, 110, 230, 330);
  ctx.font = `600 15px ${fonts.sans}`;
  ctx.fillStyle = BONE;
  ctx.fillText("Aperture", 66, 142);
  ctx.fillStyle = MAT_DARK;
  roundRect(ctx, 70, 248, 186, 14, 2);
  ctx.fill();
  for (let i = 0; i < 7; i += 1) {
    ctx.save();
    ctx.translate(86 + i * 24, 200);
    ctx.rotate(((i - 3) * 14 * Math.PI) / 180);
    ctx.fillStyle = MAT;
    ctx.fillRect(-7, -18, 14, 36);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1;
    ctx.strokeRect(-7, -18, 14, 36);
    ctx.restore();
  }
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(66, 292);
  ctx.lineTo(120, 292);
  ctx.stroke();
  ctx.font = `12px ${fonts.mono}`;
  ctx.fillStyle = MUTED;
  wrapFill(ctx, fonts.mono, "One transmitting plane. Thumbnail is not to scale with the lobes.", 66, 314, 190, 15);
}

function stateCard(
  ctx: Ctx,
  fonts: SceneFonts,
  x: number,
  y: number,
  name: string,
  angle: number,
  color: string,
  strength: number,
  alpha: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  roundPanel(ctx, x, y, 310, 330);
  ctx.strokeStyle = color;
  ctx.lineWidth = strength > 0.8 ? 2 : 1;
  roundRect(ctx, x, y, 310, 330, 10);
  ctx.stroke();
  ctx.font = `600 18px ${fonts.sans}`;
  ctx.fillStyle = color;
  ctx.fillText(name, x + 18, y + 32);
  ctx.font = `13px ${fonts.mono}`;
  ctx.fillStyle = BONE;
  ctx.fillText(`Cited pair  \u00b1${angle}\u00b0`, x + 18, y + 56);
  const ox = x + 36;
  const oy = y + 210;
  lobe(ctx, ox, oy, angle, 8, CYAN, 0.5 * strength + 0.15, 150);
  lobe(ctx, ox, oy, -angle, 8, CYAN, 0.5 * strength + 0.15, 150);
  lobe(ctx, ox, oy, 0, 3, MUTED, 0.25, 110);
  ctx.fillStyle = MAT;
  ctx.fillRect(ox - 4, oy - 24, 8, 48);
  ctx.fillStyle = MUTED;
  ctx.font = `11px ${fonts.mono}`;
  ctx.fillText("Leakage stays in frame", x + 18, y + 308);
  ctx.restore();
}

export function drawHud(ctx: Ctx, frame: number, view: ChapterId, fonts: SceneFonts): void {
  const chips: { text: string; color: string }[] = [];
  if (view === "aperture" && frame > 40) chips.push({ text: "Scale change", color: GOLD });
  if (view === "phase") chips.push({ text: "Sectional close-up. Scale change.", color: GOLD });
  if ((view === "propagate" || view === "lobes") && frame < 990) {
    chips.push({ text: "Slow motion. Time compression.", color: GOLD });
  }
  if (view === "compare" && frame >= 960) chips.push({ text: "Stable overview", color: CYAN });
  chips.push({ text: "Schematic, not a computed field", color: MUTED });

  let x = 24;
  for (const chip of chips) {
    x += hudLabel(ctx, fonts, x, 24, chip.text, chip.color) + 8;
  }
}
