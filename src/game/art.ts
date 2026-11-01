import { COLOR } from "@/game/palette";

export type ArtSet = {
  player: HTMLCanvasElement[];
  scout: HTMLCanvasElement[];
  gunner: HTMLCanvasElement[];
  brute: HTMLCanvasElement[];
  fort: HTMLCanvasElement[];
  boltP: HTMLCanvasElement[];
  boltE: HTMLCanvasElement[];
  muzzle: HTMLCanvasElement[];
  boom: HTMLCanvasElement[];
  spread: HTMLCanvasElement;
  shield: HTMLCanvasElement;
  boost: HTMLCanvasElement;
  mend: HTMLCanvasElement;
};

function bake(size: number, frames: number, draw: (ctx: CanvasRenderingContext2D, frame: number) => void) {
  const sheets: HTMLCanvasElement[] = [];
  for (let frame = 0; frame < frames; frame++) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    draw(ctx, frame);
    sheets.push(canvas);
  }
  return sheets;
}

function poly(ctx: CanvasRenderingContext2D, pts: [number, number][]) {
  ctx.beginPath();
  const first = pts[0];
  if (!first) return;
  ctx.moveTo(first[0], first[1]);
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    if (p) ctx.lineTo(p[0], p[1]);
  }
  ctx.closePath();
}

function symmetric(spine: [number, number][]): [number, number][] {
  const nose = spine[0];
  const keel = spine[spine.length - 1];
  if (!nose || !keel) return spine;
  const right = spine.slice(1, -1);
  const left = right.map(([x, y]) => [256 - x, y] as [number, number]).reverse();
  return [nose, ...right, keel, ...left];
}

function paintHull(
  ctx: CanvasRenderingContext2D,
  spine: [number, number][],
  top: string,
  bottom: string,
  engine: string,
  engines: [number, number, number, number][],
  frame: number,
  cockpitY: number,
) {
  const pts = symmetric(spine);
  const ys = pts.map((p) => p[1]);
  const topY = Math.min(...ys);
  const botY = Math.max(...ys);
  ctx.save();
  ctx.lineJoin = "round";
  ctx.shadowColor = engine;
  ctx.shadowBlur = 18;
  poly(ctx, pts);
  const gradient = ctx.createLinearGradient(128, topY, 128, botY);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(5, 10, 16, 0.92)";
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(128, topY + 20);
  ctx.lineTo(128, botY - 30);
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(247, 255, 253, 0.92)";
  ctx.beginPath();
  ctx.ellipse(128, cockpitY, 7, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(5,10,16,0.55)";
  ctx.stroke();
  const pulse = [0.45, 0.72, 1, 0.7][frame % 4] ?? 0.7;
  ctx.globalAlpha = 0.4 + 0.6 * pulse;
  ctx.fillStyle = engine;
  ctx.shadowColor = engine;
  ctx.shadowBlur = 14;
  for (const [x, y, rx, ry] of engines) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    const mirror = 256 - x;
    if (Math.abs(mirror - x) > 3) {
      ctx.beginPath();
      ctx.ellipse(mirror, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawBolt(ctx: CanvasRenderingContext2D, color: string, core: string, frame: number) {
  const stretch = [1, 1.08, 0.94, 1.02][frame % 4] ?? 1;
  ctx.save();
  ctx.translate(64, 64);
  ctx.scale(1, stretch);
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -36);
  ctx.lineTo(11, 6);
  ctx.lineTo(5, 30);
  ctx.lineTo(-5, 30);
  ctx.lineTo(-11, 6);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(4, 4);
  ctx.lineTo(0, 18);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFlash(ctx: CanvasRenderingContext2D, frame: number) {
  const scales = [0.42, 0.86, 1.12, 0.5];
  const alphas = [0.75, 1, 0.88, 0.32];
  ctx.save();
  ctx.translate(64, 64);
  ctx.scale(scales[frame] ?? 1, scales[frame] ?? 1);
  ctx.globalAlpha = alphas[frame] ?? 1;
  ctx.fillStyle = COLOR.white;
  ctx.shadowColor = COLOR.cyan;
  ctx.shadowBlur = 12;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(5, 10);
    ctx.lineTo(0, i % 2 === 0 ? 40 : 26);
    ctx.lineTo(-5, 10);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = COLOR.cyan;
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBoom(ctx: CanvasRenderingContext2D, frame: number) {
  const radii = [18, 36, 54, 64];
  const alphas = [1, 0.95, 0.72, 0.28];
  ctx.save();
  ctx.translate(96, 96);
  ctx.globalAlpha = alphas[frame] ?? 1;
  ctx.strokeStyle = COLOR.amber;
  ctx.lineWidth = 8 - frame * 1.6;
  ctx.shadowColor = COLOR.amber;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, radii[frame] ?? 40, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = frame < 2 ? COLOR.white : COLOR.danger;
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(5, 20 - frame * 4), 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLOR.amber;
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2 + frame * 0.4;
    const dist = 12 + frame * 14;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSpread(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(64, 70);
  ctx.fillStyle = COLOR.cyan;
  ctx.shadowColor = COLOR.cyan;
  ctx.shadowBlur = 14;
  for (const rot of [-0.42, 0, 0.42]) {
    ctx.save();
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, -34);
    ctx.lineTo(9, 10);
    ctx.lineTo(0, 2);
    ctx.lineTo(-9, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawShield(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(64, 64);
  ctx.lineJoin = "round";
  ctx.lineWidth = 8;
  ctx.strokeStyle = COLOR.cyan;
  ctx.fillStyle = "rgba(61, 255, 224, 0.18)";
  ctx.shadowColor = COLOR.cyan;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = -Math.PI / 2 + (i * Math.PI) / 3;
    const x = Math.cos(angle) * 36;
    const y = Math.sin(angle) * 36;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = COLOR.white;
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function chevron(ctx: CanvasRenderingContext2D, y: number, scale: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, y - 18 * scale);
  ctx.lineTo(24 * scale, y + 10 * scale);
  ctx.lineTo(12 * scale, y + 10 * scale);
  ctx.lineTo(0, y - 2 * scale);
  ctx.lineTo(-12 * scale, y + 10 * scale);
  ctx.lineTo(-24 * scale, y + 10 * scale);
  ctx.closePath();
  ctx.fill();
}

function drawBoost(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(64, 64);
  ctx.shadowColor = COLOR.amber;
  ctx.shadowBlur = 14;
  chevron(ctx, -16, 1, COLOR.amber);
  chevron(ctx, 8, 0.78, "#ffd27a");
  chevron(ctx, 28, 0.56, "#fff1d2");
  ctx.restore();
}

function drawMend(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(64, 64);
  ctx.shadowColor = "#7dffb2";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#7dffb2";
  ctx.fillRect(-8, -28, 16, 56);
  ctx.fillRect(-28, -8, 56, 16);
  ctx.shadowBlur = 0;
  ctx.fillStyle = COLOR.white;
  ctx.fillRect(-4, -16, 8, 32);
  ctx.fillRect(-16, -4, 32, 8);
  ctx.restore();
}

function drawFort(ctx: CanvasRenderingContext2D, frame: number) {
  paintHull(
    ctx,
    [
      [128, 36],
      [168, 72],
      [214, 118],
      [196, 176],
      [156, 206],
      [128, 188],
    ],
    "#f3d2c4",
    "#6e2430",
    COLOR.danger,
    [
      [108, 168, 8, 16],
      [128, 176, 10, 12],
    ],
    frame,
    104,
  );
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#1a0c10";
  ctx.fillRect(118, 48, 8, 58);
  ctx.fillRect(130, 48, 8, 58);
  ctx.fillStyle = COLOR.danger;
  ctx.shadowColor = COLOR.danger;
  ctx.shadowBlur = 10;
  const pulse = [0.55, 0.8, 1, 0.7][frame % 4] ?? 0.8;
  ctx.globalAlpha = 0.55 + 0.45 * pulse;
  ctx.beginPath();
  ctx.arc(128, 118, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function createArt(): ArtSet {
  const player = bake(256, 4, (ctx, frame) => {
    paintHull(
      ctx,
      [
        [128, 26],
        [142, 70],
        [156, 108],
        [200, 162],
        [158, 148],
        [146, 208],
        [128, 188],
      ],
      "#f4fffc",
      "#0f7d74",
      COLOR.cyan,
      [
        [116, 196, 6, 13],
      ],
      frame,
      96,
    );
  });

  const scout = bake(256, 4, (ctx, frame) => {
    paintHull(
      ctx,
      [
        [128, 34],
        [150, 86],
        [196, 160],
        [144, 148],
        [128, 214],
      ],
      "#ffd7a8",
      "#a62828",
      COLOR.amber,
      [[128, 196, 7, 14]],
      frame,
      108,
    );
  });

  const gunner = bake(256, 4, (ctx, frame) => {
    paintHull(
      ctx,
      [
        [128, 48],
        [166, 84],
        [188, 142],
        [158, 156],
        [150, 208],
        [128, 192],
      ],
      "#e7eef2",
      "#3a4854",
      COLOR.amber,
      [[118, 190, 6, 12]],
      frame,
      112,
    );
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#1a120e";
    ctx.fillRect(110, 34, 7, 46);
    ctx.fillRect(139, 34, 7, 46);
    ctx.fillStyle = COLOR.amber;
    ctx.shadowColor = COLOR.amber;
    ctx.shadowBlur = 8;
    ctx.fillRect(111, 28, 5, 12);
    ctx.fillRect(140, 28, 5, 12);
    ctx.restore();
  });

  const brute = bake(256, 4, (ctx, frame) => {
    paintHull(
      ctx,
      [
        [128, 56],
        [178, 90],
        [198, 150],
        [166, 206],
        [128, 222],
      ],
      "#d5dee4",
      "#1a232a",
      COLOR.amber,
      [[128, 200, 12, 8]],
      frame,
      128,
    );
    ctx.save();
    ctx.fillStyle = COLOR.amber;
    ctx.shadowColor = COLOR.amber;
    ctx.shadowBlur = 8;
    for (const [x, y] of [
      [178, 90],
      [198, 150],
      [166, 206],
    ] as [number, number][]) {
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.arc(256 - x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  return {
    player,
    scout,
    gunner,
    brute,
    fort: bake(256, 4, drawFort),
    boltP: bake(128, 4, (ctx, frame) => drawBolt(ctx, COLOR.cyan, COLOR.white, frame)),
    boltE: bake(128, 4, (ctx, frame) => drawBolt(ctx, COLOR.amber, "#fff1d2", frame)),
    muzzle: bake(128, 4, drawFlash),
    boom: bake(192, 4, drawBoom),
    spread: bake(128, 1, (ctx) => drawSpread(ctx))[0]!,
    shield: bake(128, 1, (ctx) => drawShield(ctx))[0]!,
    boost: bake(128, 1, (ctx) => drawBoost(ctx))[0]!,
    mend: bake(128, 1, (ctx) => drawMend(ctx))[0]!,
  };
}

export function blit(
  ctx: CanvasRenderingContext2D,
  sheet: HTMLCanvasElement | HTMLCanvasElement[],
  frame: number,
  x: number,
  y: number,
  size: number,
  rot = 0,
) {
  const img = Array.isArray(sheet) ? sheet[frame % sheet.length] : sheet;
  if (!img) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}
