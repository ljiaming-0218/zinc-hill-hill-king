import { blit, createArt, type ArtSet } from "@/game/art";
import { Sfx } from "@/game/audio";
import { COLOR } from "@/game/palette";
import { loadBest, loadMute, saveMute } from "@/game/scores";

export type Phase = "menu" | "play" | "pause" | "dying" | "over";

export type Snap = {
  phase: Phase;
  hp: number;
  maxHp: number;
  score: number;
  best: number;
  wave: number;
  left: number;
  banner: string;
  spreadTier: number;
  spreadT: number;
  shieldT: number;
  boostT: number;
  muted: boolean;
  runId: number;
  newBest: boolean;
  combo: number;
};

type Kind = "scout" | "gunner" | "brute" | "fort";
type PickupKind = "spread" | "shield" | "boost" | "mend";

type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  hp: number;
  iframe: number;
  fire: number;
  trail: number;
  alive: boolean;
};

type Enemy = {
  alive: boolean;
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  r: number;
  flash: number;
  cool: number;
  phase: number;
  score: number;
  touch: number;
  speed: number;
  size: number;
  rot: number;
  wind: number;
  pattern: number;
};

type Bullet = {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  dmg: number;
  friendly: boolean;
};

type Pickup = {
  alive: boolean;
  kind: PickupKind;
  x: number;
  y: number;
  life: number;
  bob: number;
};

type Particle = {
  alive: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
};

type Floater = {
  alive: boolean;
  x: number;
  y: number;
  vy: number;
  life: number;
  text: string;
  color: string;
};

type Fx = {
  alive: boolean;
  kind: "muzzle" | "boom";
  x: number;
  y: number;
  rot: number;
  life: number;
  max: number;
  size: number;
};

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  depth: number;
  drift: number;
  tw: number;
  twSpeed: number;
  color: string;
  spark: boolean;
};

type Spawn = { kind: Kind; x: number; y: number; t: number };

const STAT: Record<Kind, { hp: number; speed: number; r: number; score: number; touch: number; size: number }> = {
  scout: { hp: 28, speed: 168, r: 13, score: 120, touch: 10, size: 58 },
  gunner: { hp: 52, speed: 112, r: 16, score: 220, touch: 14, size: 66 },
  brute: { hp: 130, speed: 74, r: 24, score: 460, touch: 22, size: 84 },
  fort: { hp: 720, speed: 46, r: 42, score: 1800, touch: 18, size: 132 },
};

const MEND = "#7dffb2";
const MAX_HP = 100;

export function comboMultiplier(combo: number) {
  if (combo < 3) return 1;
  if (combo < 8) return 2;
  if (combo < 15) return 3;
  return 4;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function dampAngle(current: number, target: number, dt: number, rate: number) {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + delta * (1 - Math.exp(-rate * dt));
}

function take<T extends { alive: boolean }>(list: T[], make: () => T) {
  for (const item of list) if (!item.alive) return item;
  const item = make();
  list.push(item);
  return item;
}

function composeWave(wave: number): Kind[] {
  if (wave > 0 && wave % 5 === 0) return ["fort"];
  const out: Kind[] = [];
  const scouts = Math.min(8, 3 + wave);
  const gunners = wave >= 2 ? Math.min(6, wave) : 0;
  const brutes = wave >= 3 ? Math.min(3, Math.floor((wave - 1) / 2)) : 0;
  for (let i = 0; i < scouts; i++) out.push("scout");
  for (let i = 0; i < gunners; i++) out.push("gunner");
  for (let i = 0; i < brutes; i++) out.push("brute");
  return out;
}

export class Sim {
  private ctx: CanvasRenderingContext2D;
  private art: ArtSet;
  private sfx = new Sfx();
  private raf = 0;
  private acc = 0;
  private last = 0;
  private time = 0;
  private w = 1;
  private h = 1;
  private dpr = 1;
  private reduce: boolean;
  private ro: ResizeObserver;
  private keys = new Set<string>();
  private pointer = { x: 0, y: 0, active: false, down: false, kind: "mouse" };
  private phase: Phase = "menu";
  private player: Player = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    hp: MAX_HP,
    iframe: 0,
    fire: 0,
    trail: 0,
    alive: false,
  };
  private lastYaw = 0;
  private enemies: Enemy[] = [];
  private bullets: Bullet[] = [];
  private pickups: Pickup[] = [];
  private particles: Particle[] = [];
  private floats: Floater[] = [];
  private fxs: Fx[] = [];
  private stars: Star[] = [];
  private pending: Spawn[] = [];
  private queue: Kind[] = [];
  private wave = 1;
  private spawnCd = 0;
  private gap = -1;
  private announcedNext = false;
  private score = 0;
  private best = 0;
  private bestAtStart = 0;
  private celebrated = false;
  private newBest = false;
  private banner = "";
  private bannerT = 0;
  private spreadTier = 0;
  private spreadT = 0;
  private shieldT = 0;
  private boostT = 0;
  private combo = 0;
  private comboT = 0;
  private runId = 0;
  private dyingT = 0;
  private shake = 0;
  private shakeX = 0;
  private shakeY = 0;
  private nebula: HTMLCanvasElement | null = null;
  private vignette: HTMLCanvasElement | null = null;
  private sig = "";
  private target: Enemy | null = null;
  private aimX = 0;
  private aimY = -1;
  private onSnap: (snap: Snap) => void;
  private onKeyDown: (e: KeyboardEvent) => void;
  private onKeyUp: (e: KeyboardEvent) => void;
  private onBlur: () => void;
  private onVis: () => void;
  private onDown: (e: PointerEvent) => void;
  private onMove: (e: PointerEvent) => void;
  private onUp: (e: PointerEvent) => void;
  private onLeave: (e: PointerEvent) => void;

  constructor(private canvas: HTMLCanvasElement, opts: { onSnap: (snap: Snap) => void }) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("无法创建画布");
    this.ctx = ctx;
    this.art = createArt();
    this.onSnap = opts.onSnap;
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.best = loadBest();
    this.sfx.setMuted(loadMute());
    this.onKeyDown = (e) => this.handleKeyDown(e);
    this.onKeyUp = (e) => this.keys.delete(e.code);
    this.onBlur = () => this.keys.clear();
    this.onVis = () => {
      if (document.hidden && this.phase === "play") this.togglePause();
      this.keys.clear();
    };
    this.onDown = (e) => this.pointerDown(e);
    this.onMove = (e) => this.pointerMove(e);
    this.onUp = (e) => this.pointerUp(e);
    this.onLeave = (e) => this.pointerLeave(e);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("visibilitychange", this.onVis);
    canvas.addEventListener("pointerdown", this.onDown);
    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerup", this.onUp);
    canvas.addEventListener("pointercancel", this.onUp);
    canvas.addEventListener("pointerleave", this.onLeave);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.last = performance.now();
    this.raf = requestAnimationFrame((t) => this.frame(t));
    this.push(true);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("visibilitychange", this.onVis);
    this.canvas.removeEventListener("pointerdown", this.onDown);
    this.canvas.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerup", this.onUp);
    this.canvas.removeEventListener("pointercancel", this.onUp);
    this.canvas.removeEventListener("pointerleave", this.onLeave);
  }

  start() {
    if (this.phase === "play") return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    this.sfx.unlock();
    this.runId += 1;
    this.phase = "play";
    this.score = 0;
    this.wave = 1;
    this.bestAtStart = loadBest();
    this.best = this.bestAtStart;
    this.celebrated = false;
    this.newBest = false;
    this.spreadTier = 0;
    this.spreadT = 0;
    this.shieldT = 0;
    this.boostT = 0;
    this.combo = 0;
    this.comboT = 0;
    this.banner = "第 1 波";
    this.bannerT = 1.35;
    this.queue = composeWave(1);
    this.pending.length = 0;
    this.spawnCd = 0.85;
    this.gap = -1;
    this.announcedNext = false;
    this.dyingT = 0;
    this.shake = 0;
    this.target = null;
    this.aimX = 0;
    this.aimY = -1;
    this.lastYaw = 0;
    for (const list of [this.enemies, this.bullets, this.pickups, this.particles, this.floats, this.fxs]) {
      for (const item of list) item.alive = false;
    }
    this.player = {
      x: this.w / 2,
      y: this.h * 0.72,
      vx: 0,
      vy: 0,
      rot: 0,
      hp: MAX_HP,
      iframe: 0,
      fire: 0.25,
      trail: 0,
      alive: true,
    };
    this.push(true);
  }

  togglePause() {
    if (this.phase === "play") this.phase = "pause";
    else if (this.phase === "pause") {
      this.sfx.unlock();
      this.phase = "play";
    }
    this.push(true);
  }

  resume() {
    if (this.phase !== "pause") return;
    this.sfx.unlock();
    this.phase = "play";
    this.push(true);
  }

  quitToMenu() {
    this.phase = "menu";
    this.banner = "";
    this.bannerT = 0;
    this.keys.clear();
    this.pointer.down = false;
    this.push(true);
  }

  setMuted(muted: boolean) {
    this.sfx.setMuted(muted);
    saveMute(muted);
    this.push(true);
  }

  setKeys(codes: string[]) {
    this.keys.clear();
    for (const code of codes) this.keys.add(code);
    this.pointer.active = false;
    this.pointer.down = false;
  }

  getMovementYaw() {
    const sp = Math.hypot(this.player.vx, this.player.vy);
    if (sp < 12) return this.lastYaw;
    this.lastYaw = Math.atan2(-this.player.vx, -this.player.vy);
    return this.lastYaw;
  }

  getSpeed() {
    return Math.hypot(this.player.vx, this.player.vy);
  }

  getX() {
    return this.player.x;
  }

  getY() {
    return this.player.y;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
    this.sfx.unlock();
    if ((e.code === "Enter" || e.code === "Space") && this.phase === "menu") {
      e.preventDefault();
      this.start();
      return;
    }
    if (e.code === "Escape" || e.code === "KeyP") {
      e.preventDefault();
      this.togglePause();
      return;
    }
    this.keys.add(e.code);
  }

  private pointerDown(e: PointerEvent) {
    this.sfx.unlock();
    this.readPointer(e);
    this.pointer.active = true;
    this.pointer.down = true;
  }

  private pointerMove(e: PointerEvent) {
    this.readPointer(e);
    if (e.pointerType === "mouse" || this.pointer.down) this.pointer.active = true;
  }

  private pointerUp(e: PointerEvent) {
    this.pointer.down = false;
    if (e.pointerType !== "mouse") this.pointer.active = false;
  }

  private pointerLeave(e: PointerEvent) {
    if (!this.pointer.down) this.pointer.active = false;
    if (e.pointerType !== "mouse") this.pointer.active = false;
  }

  private readPointer(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (e.pointerType === "touch") y -= 78;
    this.pointer.kind = e.pointerType;
    this.pointer.x = clamp(x, 18, Math.max(18, this.w - 18));
    this.pointer.y = clamp(y, 18, Math.max(18, this.h - 18));
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    this.w = w;
    this.h = h;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.ensureStars();
    this.bakeBackdrop();
    if (!this.player.alive && this.phase === "menu") {
      this.player.x = w / 2;
      this.player.y = h * 0.72;
    }
  }

  private ensureStars() {
    const count = clamp(Math.round((this.w * this.h) / 11000), 48, 150);
    const colors = [COLOR.white, COLOR.mist, COLOR.cyan, COLOR.amber];
    while (this.stars.length < count) {
      const depth = this.stars.length % 3 === 0 ? 0.7 : this.stars.length % 3 === 1 ? 0.35 : 0.12;
      this.stars.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        r: depth > 0.5 ? 2.1 : depth > 0.2 ? 1.5 : 1,
        a: 0.35 + depth * 0.55,
        depth,
        drift: 10 + depth * 46,
        tw: Math.random() * 10,
        twSpeed: 0.8 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * (depth > 0.5 ? 4 : 2))] ?? COLOR.white,
        spark: depth > 0.5 && Math.random() > 0.72,
      });
    }
    if (this.stars.length > count) this.stars.length = count;
  }

  private bakeBackdrop() {
    const nebula = document.createElement("canvas");
    nebula.width = Math.max(2, Math.ceil(this.w * 1.5));
    nebula.height = Math.max(2, Math.ceil(this.h * 1.5));
    const ng = nebula.getContext("2d");
    if (ng) {
      ng.fillStyle = COLOR.void;
      ng.fillRect(0, 0, nebula.width, nebula.height);
      const blob = (x: number, y: number, r: number, color: string) => {
        const g = ng.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ng.fillStyle = g;
        ng.beginPath();
        ng.arc(x, y, r, 0, Math.PI * 2);
        ng.fill();
      };
      blob(nebula.width * 0.32, nebula.height * 0.38, nebula.width * 0.38, "rgba(61,255,224,0.10)");
      blob(nebula.width * 0.72, nebula.height * 0.62, nebula.width * 0.32, "rgba(255,176,58,0.06)");
      blob(nebula.width * 0.5, nebula.height * 0.2, nebula.width * 0.22, "rgba(20,70,82,0.45)");
    }
    this.nebula = nebula;

    const vignette = document.createElement("canvas");
    vignette.width = Math.max(2, Math.ceil(this.w));
    vignette.height = Math.max(2, Math.ceil(this.h));
    const vg = vignette.getContext("2d");
    if (vg) {
      const g = vg.createRadialGradient(
        this.w / 2,
        this.h / 2,
        Math.min(this.w, this.h) * 0.2,
        this.w / 2,
        this.h / 2,
        Math.max(this.w, this.h) * 0.68,
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.55)");
      vg.fillStyle = g;
      vg.fillRect(0, 0, this.w, this.h);
    }
    this.vignette = vignette;
  }

  private frame(now: number) {
    const raw = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    if (this.hitStopActive(raw)) {
      this.render();
      this.raf = requestAnimationFrame((t) => this.frame(t));
      return;
    }
    if (this.phase === "menu" || this.phase === "pause" || this.phase === "over") {
      if (this.phase === "menu") {
        this.time += raw;
        this.updateStars(raw);
      }
      this.render();
      this.push(false);
      this.raf = requestAnimationFrame((t) => this.frame(t));
      return;
    }
    this.acc += raw;
    const step = 1 / 60;
    let guard = 0;
    while (this.acc >= step && guard < 5) {
      this.update(step);
      this.acc -= step;
      guard += 1;
    }
    this.render();
    this.push(false);
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private hitStop = 0;
  private hitStopActive(raw: number) {
    if (this.hitStop <= 0 || this.reduce || this.phase !== "play") return false;
    this.hitStop -= raw;
    return true;
  }

  private update(dt: number) {
    this.time += dt;
    if (this.bannerT > 0) {
      this.bannerT -= dt;
      if (this.bannerT <= 0) {
        this.bannerT = 0;
        this.banner = "";
      }
    }
    this.updateStars(dt);
    this.shake *= Math.exp(-4.2 * dt);
    this.shakeX = (Math.random() - 0.5) * this.shake * 2;
    this.shakeY = (Math.random() - 0.5) * this.shake * 2;
    if (this.phase === "dying") {
      this.dyingT -= dt;
      this.updateFx(dt);
      if (this.dyingT <= 0) {
        this.phase = "over";
        this.push(true);
      }
      return;
    }
    this.tickBuffs(dt);
    if (this.comboT > 0) {
      this.comboT -= dt;
      if (this.comboT <= 0) {
        this.comboT = 0;
        this.combo = 0;
      }
    }
    this.movePlayer(dt);
    this.updateSpawns(dt);
    this.updateEnemies(dt);
    this.aimAndFire(dt);
    this.updateBullets(dt);
    this.collide();
    this.updatePickups(dt);
    this.updateFx(dt);
    this.engineTrail(dt);
    this.maybeClearWave(dt);
  }

  private tickBuffs(dt: number) {
    this.player.iframe = Math.max(0, this.player.iframe - dt);
    this.player.fire = Math.max(0, this.player.fire - dt);
    if (this.spreadT > 0) {
      this.spreadT -= dt;
      if (this.spreadT <= 0) {
        this.spreadT = 0;
        this.spreadTier = 0;
      }
    }
    this.shieldT = Math.max(0, this.shieldT - dt);
    this.boostT = Math.max(0, this.boostT - dt);
  }

  private movePlayer(dt: number) {
    let ix = 0;
    let iy = 0;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) ix -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) ix += 1;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) iy -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) iy += 1;
    const keyMag = Math.hypot(ix, iy);
    const max = 360 * (this.boostT > 0 ? 1.5 : 1);
    let dx = 0;
    let dy = 0;
    if (keyMag > 0) {
      dx = (ix / keyMag) * max;
      dy = (iy / keyMag) * max;
    } else if (this.pointer.active) {
      const px = this.pointer.x - this.player.x;
      const py = this.pointer.y - this.player.y;
      const dist = Math.hypot(px, py);
      if (dist > 6) {
        const want = Math.min(max, dist * 6.5);
        dx = (px / dist) * want;
        dy = (py / dist) * want;
      }
    }
    const k = 1 - Math.exp(-9 * dt);
    this.player.vx += (dx - this.player.vx) * k;
    this.player.vy += (dy - this.player.vy) * k;
    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;
    const pad = 20;
    if (this.player.x < pad) {
      this.player.x = pad;
      this.player.vx = Math.max(0, this.player.vx);
    } else if (this.player.x > this.w - pad) {
      this.player.x = this.w - pad;
      this.player.vx = Math.min(0, this.player.vx);
    }
    if (this.player.y < pad) {
      this.player.y = pad;
      this.player.vy = Math.max(0, this.player.vy);
    } else if (this.player.y > this.h - pad) {
      this.player.y = this.h - pad;
      this.player.vy = Math.min(0, this.player.vy);
    }
  }

  private updateSpawns(dt: number) {
    if (this.gap >= 0) return;
    this.spawnCd -= dt;
    if (this.queue.length > 0 && this.spawnCd <= 0) {
      const kind = this.queue.shift();
      if (kind) {
        const point = this.edgePoint();
        this.pending.push({ kind, x: point.x, y: point.y, t: 0.42 });
      }
      this.spawnCd = Math.max(0.32, 0.78 - this.wave * 0.03);
    }
    for (let i = this.pending.length - 1; i >= 0; i--) {
      const spawn = this.pending[i];
      if (!spawn) continue;
      spawn.t -= dt;
      if (spawn.t <= 0) {
        this.birth(spawn);
        this.pending.splice(i, 1);
      }
    }
  }

  private edgePoint() {
    const minDist = Math.min(190, Math.min(this.w, this.h) * 0.42);
    let best = { x: this.w / 2, y: 12 };
    let bestD = -1;
    for (let i = 0; i < 8; i++) {
      const side = Math.floor(Math.random() * 4);
      const m = 10;
      const point =
        side === 0
          ? { x: m + Math.random() * (this.w - m * 2), y: m }
          : side === 1
            ? { x: this.w - m, y: m + Math.random() * (this.h - m * 2) }
            : side === 2
              ? { x: m + Math.random() * (this.w - m * 2), y: this.h - m }
              : { x: m, y: m + Math.random() * (this.h - m * 2) };
      const d = Math.hypot(point.x - this.player.x, point.y - this.player.y);
      if (d > bestD) {
        best = point;
        bestD = d;
      }
      if (d >= minDist) return point;
    }
    return best;
  }

  private birth(spawn: Spawn) {
    const stat = STAT[spawn.kind];
    const scale =
      spawn.kind === "fort"
        ? 1 + Math.max(0, Math.floor(this.wave / 5) - 1) * 0.28
        : 1 + (this.wave - 1) * 0.055;
    const enemy = take(this.enemies, () => this.blankEnemy());
    enemy.alive = true;
    enemy.kind = spawn.kind;
    enemy.x = spawn.x;
    enemy.y = spawn.y;
    enemy.vx = 0;
    enemy.vy = 0;
    enemy.maxHp = Math.round(stat.hp * scale);
    enemy.hp = enemy.maxHp;
    enemy.r = stat.r;
    enemy.flash = 0;
    enemy.cool = spawn.kind === "fort" ? 1.15 : 0.55 + Math.random() * 0.9;
    enemy.phase = Math.random() * Math.PI * 2;
    enemy.score = stat.score + this.wave * 8;
    enemy.touch = stat.touch;
    enemy.speed = stat.speed * (1 + Math.min(0.45, (this.wave - 1) * 0.035));
    enemy.size = stat.size;
    enemy.rot = 0;
    enemy.wind = 0;
    enemy.pattern = 0;
    if (spawn.kind === "fort") {
      this.setBanner("要塞来袭", 1.5);
      this.sfx.warn();
    }
  }

  private blankEnemy(): Enemy {
    return {
      alive: false,
      kind: "scout",
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      hp: 1,
      maxHp: 1,
      r: 10,
      flash: 0,
      cool: 0,
      phase: 0,
      score: 0,
      touch: 0,
      speed: 0,
      size: 40,
      rot: 0,
      wind: 0,
      pattern: 0,
    };
  }

  private updateEnemies(dt: number) {
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      enemy.flash = Math.max(0, enemy.flash - dt);
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = dx / dist;
      const ny = dy / dist;
      if (enemy.kind === "fort") {
        this.stepFort(enemy, dt, nx, ny);
        continue;
      }
      let sx = 0;
      let sy = 0;
      for (const other of this.enemies) {
        if (!other.alive || other === enemy) continue;
        const ox = enemy.x - other.x;
        const oy = enemy.y - other.y;
        const d2 = ox * ox + oy * oy;
        if (d2 > 0 && d2 < 48 * 48) {
          const d = Math.sqrt(d2);
          sx += ox / d;
          sy += oy / d;
        }
      }
      let steerX = nx;
      let steerY = ny;
      if (enemy.kind === "scout") {
        const strafe = Math.sin(this.time * 3.1 + enemy.phase);
        steerX = nx - ny * strafe * 0.9;
        steerY = ny + nx * strafe * 0.9;
      } else if (enemy.kind === "gunner") {
        if (dist > 280) {
          steerX = nx;
          steerY = ny;
        } else if (dist < 190) {
          steerX = -nx;
          steerY = -ny;
        } else {
          steerX = -ny;
          steerY = nx;
        }
        enemy.cool -= dt;
        if (enemy.cool <= 0 && dist < 560) {
          enemy.cool = Math.max(0.7, 1.45 - this.wave * 0.045);
          this.enemyShot(enemy, dx, dy, { speed: 250 + this.wave * 6, dmg: 12, r: 6, life: 2.4 });
        }
      } else if (enemy.kind === "brute" && dist < 500) {
        enemy.cool -= dt;
        if (enemy.cool <= 0) {
          enemy.cool = Math.max(1.7, 2.5 - this.wave * 0.04);
          this.enemyShot(enemy, dx, dy, { speed: 168, dmg: 16, r: 9, life: 2.8 });
        }
      }
      steerX += sx * 0.85;
      steerY += sy * 0.85;
      const mag = Math.hypot(steerX, steerY) || 1;
      const tvx = (steerX / mag) * enemy.speed;
      const tvy = (steerY / mag) * enemy.speed;
      const k = Math.min(1, dt * 3.2);
      enemy.vx += (tvx - enemy.vx) * k;
      enemy.vy += (tvy - enemy.vy) * k;
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
      enemy.rot = dampAngle(enemy.rot, Math.atan2(nx, -ny), dt, 7);
    }
  }

  private stepFort(enemy: Enemy, dt: number, nx: number, ny: number) {
    const orbitX = this.w * 0.5 + Math.sin(this.time * 0.35 + enemy.phase) * Math.min(160, this.w * 0.18);
    const orbitY = Math.min(this.h * 0.34, 210) + Math.cos(this.time * 0.28) * 18;
    let steerX = orbitX - enemy.x;
    let steerY = orbitY - enemy.y;
    const mag = Math.hypot(steerX, steerY) || 1;
    const pace = enemy.wind > 0 ? 0.35 : 1;
    const tvx = (steerX / mag) * enemy.speed * pace;
    const tvy = (steerY / mag) * enemy.speed * pace;
    const k = Math.min(1, dt * 2.2);
    enemy.vx += (tvx - enemy.vx) * k;
    enemy.vy += (tvy - enemy.vy) * k;
    enemy.x = clamp(enemy.x + enemy.vx * dt, enemy.r + 8, this.w - enemy.r - 8);
    enemy.y = clamp(enemy.y + enemy.vy * dt, enemy.r + 8, this.h * 0.62);
    enemy.rot = dampAngle(enemy.rot, Math.atan2(nx, -ny), dt, 4);
    if (enemy.wind > 0) {
      enemy.wind -= dt;
      if (enemy.wind <= 0) {
        enemy.wind = 0;
        if (enemy.pattern % 2 === 0) this.fanShot(enemy);
        else this.ringShot(enemy);
        enemy.pattern += 1;
        enemy.cool = 1.25;
      }
      return;
    }
    enemy.cool -= dt;
    if (enemy.cool <= 0) {
      enemy.wind = 0.72;
      this.sfx.warn();
    }
  }

  private enemyShot(
    enemy: Enemy,
    dx: number,
    dy: number,
    shot: { speed: number; dmg: number; r: number; life: number },
  ) {
    const base = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.08;
    this.launchEnemy(enemy, base, shot.speed, shot.dmg, shot.r, shot.life);
  }

  private fanShot(enemy: Enemy) {
    const base = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
    for (const off of [-0.28, 0, 0.28]) {
      this.launchEnemy(enemy, base + off, 280, 13, 6, 2.6);
    }
  }

  private ringShot(enemy: Enemy) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + enemy.phase;
      this.launchEnemy(enemy, angle, 148, 11, 7, 3.3);
    }
  }

  private launchEnemy(enemy: Enemy, angle: number, speed: number, dmg: number, r: number, life: number) {
    const bullet = this.makeBullet();
    if (!bullet) return;
    bullet.x = enemy.x + Math.cos(angle) * (enemy.r + 8);
    bullet.y = enemy.y + Math.sin(angle) * (enemy.r + 8);
    bullet.vx = Math.cos(angle) * speed;
    bullet.vy = Math.sin(angle) * speed;
    bullet.life = life;
    bullet.r = r;
    bullet.dmg = dmg;
    bullet.friendly = false;
    this.muzzle(bullet.x, bullet.y, Math.atan2(bullet.vx, -bullet.vy), r > 7 ? 40 : 32);
  }

  private aimAndFire(dt: number) {
    let best: Enemy | null = null;
    let bestD = Infinity;
    const range = Math.max(300, Math.min(this.w, this.h) * 0.78);
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      const d = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
      if (d < bestD && d < range) {
        best = enemy;
        bestD = d;
      }
    }
    this.target = best;
    let ax = this.aimX;
    let ay = this.aimY;
    if (best) {
      ax = best.x - this.player.x;
      ay = best.y - this.player.y;
    } else if (Math.hypot(this.player.vx, this.player.vy) > 40) {
      ax = this.player.vx;
      ay = this.player.vy;
    }
    const mag = Math.hypot(ax, ay) || 1;
    this.aimX = ax / mag;
    this.aimY = ay / mag;
    const face = Math.atan2(this.aimX, -this.aimY);
    this.player.rot = dampAngle(this.player.rot, face, dt, 12);
    const manual = this.keys.has("Space") || this.pointer.down;
    const auto = Boolean(best);
    if ((manual || auto) && this.player.fire <= 0 && this.player.alive) this.fire();
  }

  private fire() {
    const count = this.spreadTier <= 0 ? 1 : this.spreadTier === 1 ? 3 : 5;
    const arc = this.spreadTier <= 0 ? 0 : this.spreadTier === 1 ? 0.2 : 0.18;
    const dmg = this.spreadTier <= 0 ? 18 : this.spreadTier === 1 ? 13 : 11;
    const base = Math.atan2(this.aimY, this.aimX);
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : (i / (count - 1) - 0.5) * 2;
      const angle = base + t * arc;
      const bullet = this.makeBullet();
      if (!bullet) break;
      bullet.x = this.player.x + Math.cos(angle) * 22;
      bullet.y = this.player.y + Math.sin(angle) * 22;
      bullet.vx = Math.cos(angle) * 760;
      bullet.vy = Math.sin(angle) * 760;
      bullet.life = 1.05;
      bullet.r = 6;
      bullet.dmg = dmg;
      bullet.friendly = true;
      this.muzzle(bullet.x, bullet.y, Math.atan2(bullet.vx, -bullet.vy), count > 1 ? 32 : 44);
    }
    this.player.fire = 0.15;
    this.shake = Math.min(5, this.shake + (this.reduce ? 0 : 1.2));
    this.sfx.shoot();
  }

  private makeBullet() {
    let alive = 0;
    for (const bullet of this.bullets) if (bullet.alive) alive += 1;
    if (alive > 96) return null;
    const bullet = take(this.bullets, () => ({
      alive: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      r: 4,
      dmg: 0,
      friendly: true,
    }));
    bullet.alive = true;
    return bullet;
  }

  private updateBullets(dt: number) {
    const margin = 48;
    for (const bullet of this.bullets) {
      if (!bullet.alive) continue;
      bullet.life -= dt;
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      if (
        bullet.life <= 0 ||
        bullet.x < -margin ||
        bullet.y < -margin ||
        bullet.x > this.w + margin ||
        bullet.y > this.h + margin
      ) {
        bullet.alive = false;
      }
    }
  }

  private collide() {
    for (const bullet of this.bullets) {
      if (!bullet.alive || !bullet.friendly) continue;
      for (const enemy of this.enemies) {
        if (!enemy.alive) continue;
        if (!overlap(bullet.x, bullet.y, bullet.r, enemy.x, enemy.y, enemy.r)) continue;
        bullet.alive = false;
        enemy.hp -= bullet.dmg;
        enemy.flash = 0.08;
        this.burst(enemy.x, enemy.y, COLOR.amber, 5, 90);
        this.sfx.hit();
        if (enemy.hp <= 0) this.killEnemy(enemy);
        break;
      }
    }
    if (!this.player.alive) return;
    for (const bullet of this.bullets) {
      if (!bullet.alive || bullet.friendly) continue;
      if (!overlap(bullet.x, bullet.y, bullet.r, this.player.x, this.player.y, 15)) continue;
      bullet.alive = false;
      this.hurt(bullet.dmg);
    }
    for (const enemy of this.enemies) {
      if (!enemy.alive) continue;
      if (!overlap(enemy.x, enemy.y, enemy.r, this.player.x, this.player.y, 15)) continue;
      const dx = enemy.x - this.player.x;
      const dy = enemy.y - this.player.y;
      const dist = Math.hypot(dx, dy) || 1;
      enemy.x += (dx / dist) * 16;
      enemy.y += (dy / dist) * 16;
      this.hurt(enemy.touch);
    }
  }

  private hurt(dmg: number) {
    if (!this.player.alive || this.player.iframe > 0) return;
    if (this.shieldT > 0) {
      this.player.iframe = 0.18;
      this.burst(this.player.x, this.player.y, COLOR.cyan, 8, 140);
      this.shake = Math.min(6, this.shake + (this.reduce ? 0 : 2));
      this.sfx.hit();
      return;
    }
    this.player.hp = Math.max(0, this.player.hp - dmg);
    this.player.iframe = 0.7;
    this.float(`-${dmg}`, this.player.x, this.player.y - 18, COLOR.danger);
    this.burst(this.player.x, this.player.y, COLOR.danger, 8, 120);
    this.shake = Math.min(8, this.shake + (this.reduce ? 0 : 4));
    this.sfx.hurt();
    if (this.player.hp <= 0) this.killPlayer();
  }

  private killEnemy(enemy: Enemy) {
    enemy.alive = false;
    this.combo += 1;
    this.comboT = 2.15;
    const mult = comboMultiplier(this.combo);
    this.addScore(enemy.score * mult, enemy.x, enemy.y - 16);
    if (mult > 1 && (this.combo === 3 || this.combo === 8 || this.combo === 15)) {
      this.float(`×${mult}`, enemy.x, enemy.y - 36, COLOR.amber);
    }
    this.boom(enemy.x, enemy.y, enemy.kind === "fort" ? 168 : enemy.size * 1.15);
    this.burst(enemy.x, enemy.y, enemy.kind === "scout" ? COLOR.amber : COLOR.danger, enemy.kind === "fort" ? 26 : 14, 180);
    this.sfx.explode();
    if (!this.reduce) this.hitStop = Math.max(this.hitStop, enemy.kind === "fort" ? 0.09 : 0.04);
    this.shake = Math.min(enemy.kind === "fort" ? 10 : 7, this.shake + (this.reduce ? 0 : enemy.kind === "fort" ? 6 : 3.5));
    if (enemy.kind === "fort") {
      this.drop(enemy.x - 36, enemy.y, "spread");
      this.drop(enemy.x + 36, enemy.y, "shield");
      this.drop(enemy.x, enemy.y + 28, "mend");
      return;
    }
    if (this.livePickups() < 4 && Math.random() < 0.36) {
      const roll = Math.random();
      const kind: PickupKind = roll < 0.32 ? "spread" : roll < 0.58 ? "shield" : roll < 0.84 ? "boost" : "mend";
      this.drop(enemy.x, enemy.y, kind);
    }
  }

  private killPlayer() {
    this.player.alive = false;
    this.player.hp = 0;
    this.boom(this.player.x, this.player.y, 110);
    this.burst(this.player.x, this.player.y, COLOR.cyan, 18, 220);
    this.phase = "dying";
    this.dyingT = 0.72;
    this.sfx.explode();
    this.shake = this.reduce ? 0 : 8;
    this.push(true);
  }

  private drop(x: number, y: number, kind: PickupKind = "spread") {
    const pickup = take(this.pickups, () => ({
      alive: false,
      kind: "spread" as PickupKind,
      x: 0,
      y: 0,
      life: 0,
      bob: 0,
    }));
    pickup.alive = true;
    pickup.kind = kind;
    pickup.x = clamp(x, 24, this.w - 24);
    pickup.y = clamp(y, 24, this.h - 24);
    pickup.life = 12;
    pickup.bob = Math.random() * Math.PI * 2;
  }

  private livePickups() {
    let n = 0;
    for (const pickup of this.pickups) if (pickup.alive) n += 1;
    return n;
  }

  private updatePickups(dt: number) {
    for (const pickup of this.pickups) {
      if (!pickup.alive) continue;
      pickup.life -= dt;
      pickup.bob += dt * 3;
      const dx = this.player.x - pickup.x;
      const dy = this.player.y - pickup.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 120) {
        pickup.x += (dx / dist) * 120 * dt;
        pickup.y += (dy / dist) * 120 * dt;
      }
      if (pickup.life <= 0) pickup.alive = false;
      else if (this.player.alive && dist < 28) this.collect(pickup);
    }
  }

  private collect(pickup: Pickup) {
    pickup.alive = false;
    if (pickup.kind === "spread") {
      this.spreadTier = Math.min(2, this.spreadTier + 1);
      this.spreadT = 9;
      this.setBanner(this.spreadTier >= 2 ? "五重射击" : "多重射击", 0.9);
    } else if (pickup.kind === "shield") {
      this.shieldT = 6.5;
      this.setBanner("护盾", 0.9);
    } else if (pickup.kind === "boost") {
      this.boostT = 7;
      this.setBanner("加速", 0.9);
    } else {
      const before = this.player.hp;
      this.player.hp = Math.min(MAX_HP, this.player.hp + 28);
      const healed = Math.round(this.player.hp - before);
      this.float(healed > 0 ? `+${healed}` : "满血", this.player.x, this.player.y - 20, MEND);
      this.setBanner("修复", 0.9);
    }
    const burstColor = pickup.kind === "boost" ? COLOR.amber : pickup.kind === "mend" ? MEND : COLOR.cyan;
    this.burst(pickup.x, pickup.y, burstColor, 10, 120);
    this.sfx.pickup();
  }

  private maybeClearWave(dt: number) {
    if (this.queue.length > 0 || this.pending.length > 0) return;
    for (const enemy of this.enemies) if (enemy.alive) return;
    if (this.gap < 0) {
      this.gap = 2.15;
      this.addScore(180 * this.wave);
      this.setBanner(this.wave % 5 === 0 ? "要塞击毁" : "波次清空", 1.15);
      this.announcedNext = false;
      this.sfx.wave();
      return;
    }
    this.gap -= dt;
    if (!this.announcedNext && this.gap < 1.15) {
      this.announcedNext = true;
      this.wave += 1;
      this.setBanner(`第 ${this.wave} 波`, 1.15);
    }
    if (this.gap <= 0) {
      this.gap = -1;
      this.queue = composeWave(this.wave);
      this.spawnCd = 0.35;
    }
  }

  private addScore(n: number, x?: number, y?: number) {
    this.score += n;
    if (x != null && y != null) this.float(`+${n}`, x, y, COLOR.amber);
    if (this.bestAtStart > 0 && !this.celebrated && this.score > this.bestAtStart) {
      this.celebrated = true;
      this.newBest = true;
      this.setBanner("新纪录", 1.1);
    }
    if (this.score > this.best) {
      this.best = this.score;
      if (this.score > this.bestAtStart) this.newBest = true;
    }
  }

  private setBanner(text: string, time: number) {
    this.banner = text;
    this.bannerT = time;
  }

  private updateStars(dt: number) {
    const moving = this.phase === "play" || this.phase === "dying" || this.phase === "pause";
    const vx = moving ? this.player.vx : 0;
    const vy = moving ? this.player.vy : 0;
    for (const star of this.stars) {
      star.x -= vx * star.depth * dt;
      star.y -= vy * star.depth * dt;
      star.y += star.drift * dt;
      star.tw += dt * star.twSpeed;
      if (star.y > this.h + 4) star.y = -4;
      if (star.y < -4) star.y = this.h + 4;
      if (star.x > this.w + 4) star.x = -4;
      if (star.x < -4) star.x = this.w + 4;
    }
  }

  private engineTrail(dt: number) {
    const speed = Math.hypot(this.player.vx, this.player.vy);
    if (!this.player.alive || speed < 48) return;
    this.player.trail -= dt;
    if (this.player.trail > 0) return;
    this.player.trail = this.boostT > 0 ? 0.02 : 0.035;
    const dx = Math.sin(this.player.rot);
    const dy = -Math.cos(this.player.rot);
    this.burst(
      this.player.x - dx * 18,
      this.player.y - dy * 18,
      this.boostT > 0 ? COLOR.amber : COLOR.cyan,
      1,
      40,
    );
  }

  private burst(x: number, y: number, color: string, n: number, speed: number) {
    let live = 0;
    for (const particle of this.particles) if (particle.alive) live += 1;
    for (let i = 0; i < n; i++) {
      if (live > 200) return;
      const angle = Math.random() * Math.PI * 2;
      const vel = speed * (0.35 + Math.random());
      const particle = take(this.particles, () => ({
        alive: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        max: 1,
        size: 2,
        color,
      }));
      particle.alive = true;
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * vel;
      particle.vy = Math.sin(angle) * vel;
      particle.max = 0.28 + Math.random() * 0.32;
      particle.life = particle.max;
      particle.size = 1.4 + Math.random() * 2.2;
      particle.color = color;
      live += 1;
    }
  }

  private muzzle(x: number, y: number, rot: number, size: number) {
    const fx = take(this.fxs, () => this.blankFx());
    fx.alive = true;
    fx.kind = "muzzle";
    fx.x = x;
    fx.y = y;
    fx.rot = rot;
    fx.max = 0.09;
    fx.life = fx.max;
    fx.size = size;
  }

  private boom(x: number, y: number, size: number) {
    const fx = take(this.fxs, () => this.blankFx());
    fx.alive = true;
    fx.kind = "boom";
    fx.x = x;
    fx.y = y;
    fx.rot = Math.random() * Math.PI;
    fx.max = 0.42;
    fx.life = fx.max;
    fx.size = size;
  }

  private blankFx(): Fx {
    return { alive: false, kind: "boom", x: 0, y: 0, rot: 0, life: 0, max: 1, size: 40 };
  }

  private updateFx(dt: number) {
    for (const particle of this.particles) {
      if (!particle.alive) continue;
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      if (particle.life <= 0) particle.alive = false;
    }
    for (const fx of this.fxs) {
      if (!fx.alive) continue;
      fx.life -= dt;
      if (fx.life <= 0) fx.alive = false;
    }
    for (const floater of this.floats) {
      if (!floater.alive) continue;
      floater.life -= dt;
      floater.y += floater.vy * dt;
      if (floater.life <= 0) floater.alive = false;
    }
  }

  private float(text: string, x: number, y: number, color: string) {
    const floater = take(this.floats, () => ({
      alive: false,
      x: 0,
      y: 0,
      vy: -36,
      life: 0,
      text: "",
      color,
    }));
    floater.alive = true;
    floater.x = x;
    floater.y = y;
    floater.vy = -42;
    floater.life = 0.7;
    floater.text = text;
    floater.color = color;
  }

  private render() {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.save();
    if (!this.reduce) ctx.translate(this.shakeX, this.shakeY);
    this.drawBackdrop(ctx);
    this.drawStars(ctx);
    this.drawSpawns(ctx);
    this.drawPickups(ctx);
    this.drawBullets(ctx, false);
    this.drawEnemies(ctx);
    this.drawBullets(ctx, true);
    this.drawPlayer(ctx);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    this.drawFx(ctx);
    this.drawParticles(ctx);
    ctx.restore();
    this.drawFloats(ctx);
    this.drawPointer(ctx);
    ctx.restore();
    if (this.vignette) ctx.drawImage(this.vignette, 0, 0, this.w, this.h);
    this.drawHurtVeil(ctx);
    if (this.phase === "menu") this.drawShowcase(ctx);
  }

  private drawBackdrop(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = COLOR.void;
    ctx.fillRect(-20, -20, this.w + 40, this.h + 40);
    if (!this.nebula) return;
    const moving = this.phase !== "menu";
    const px = moving ? this.player.x : this.w / 2;
    const py = moving ? this.player.y : this.h / 2;
    const maxX = Math.max(0, this.nebula.width - this.w);
    const maxY = Math.max(0, this.nebula.height - this.h);
    const sx = clamp(maxX * (0.45 + 0.08 * Math.sin(this.time * 0.05)) + (px - this.w / 2) * 0.08, 0, maxX);
    const sy = clamp(((this.time * 14) % (maxY + 1)) + (py - this.h / 2) * 0.08, 0, maxY);
    ctx.drawImage(this.nebula, sx, sy, this.w, this.h, 0, 0, this.w, this.h);
  }

  private drawStars(ctx: CanvasRenderingContext2D) {
    for (const star of this.stars) {
      const tw = 0.55 + 0.45 * Math.sin(star.tw);
      ctx.globalAlpha = star.a * tw;
      ctx.fillStyle = star.color;
      ctx.fillRect(star.x, star.y, star.r, star.r);
      if (star.spark) {
        ctx.fillRect(star.x - 2.5, star.y + star.r / 2 - 0.4, 6, 0.8);
        ctx.fillRect(star.x + star.r / 2 - 0.4, star.y - 2.5, 0.8, 6);
      }
    }
    ctx.globalAlpha = 1;
  }

  private drawSpawns(ctx: CanvasRenderingContext2D) {
    for (const spawn of this.pending) {
      const k = 1 - spawn.t / 0.42;
      ctx.save();
      ctx.globalAlpha = 0.35 + k * 0.5;
      ctx.strokeStyle = COLOR.danger;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(spawn.x, spawn.y, 8 + k * 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawPickups(ctx: CanvasRenderingContext2D) {
    for (const pickup of this.pickups) {
      if (!pickup.alive) continue;
      const blink = pickup.life < 2.6 ? 0.45 + 0.55 * Math.sin(this.time * 14) : 1;
      const icon =
        pickup.kind === "spread"
          ? this.art.spread
          : pickup.kind === "shield"
            ? this.art.shield
            : pickup.kind === "boost"
              ? this.art.boost
              : this.art.mend;
      const color = pickup.kind === "boost" ? COLOR.amber : pickup.kind === "mend" ? MEND : COLOR.cyan;
      ctx.save();
      ctx.globalAlpha = blink;
      ctx.translate(pickup.x, pickup.y + Math.sin(pickup.bob) * 3);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.drawImage(icon, -15, -15, 30, 30);
      ctx.restore();
    }
  }

  private drawBullets(ctx: CanvasRenderingContext2D, friendly: boolean) {
    const sheet = friendly ? this.art.boltP : this.art.boltE;
    const frame = Math.floor(this.time * 16) % 4;
    for (const bullet of this.bullets) {
      if (!bullet.alive || bullet.friendly !== friendly) continue;
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.strokeStyle = friendly ? COLOR.cyan : COLOR.amber;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y);
      ctx.lineTo(bullet.x - bullet.vx * 0.028, bullet.y - bullet.vy * 0.028);
      ctx.stroke();
      ctx.restore();
      blit(ctx, sheet, frame, bullet.x, bullet.y, friendly ? 36 : 32, Math.atan2(bullet.vx, -bullet.vy));
    }
  }

  private drawEnemies(ctx: CanvasRenderingContext2D) {
    const order: Kind[] = ["brute", "gunner", "scout", "fort"];
    for (const kind of order) {
      for (const enemy of this.enemies) {
        if (!enemy.alive || enemy.kind !== kind) continue;
        const sheet = this.art[kind];
        if (enemy.flash > 0) ctx.filter = "brightness(2.6) saturate(0.2)";
        blit(ctx, sheet, Math.floor(this.time * 10), enemy.x, enemy.y, enemy.size, enemy.rot);
        ctx.filter = "none";
        if (enemy.hp < enemy.maxHp) {
          const width = enemy.kind === "fort" ? 72 : 26;
          const y = enemy.y - enemy.r - 12;
          ctx.fillStyle = COLOR.line;
          ctx.fillRect(enemy.x - width / 2, y, width, enemy.kind === "fort" ? 5 : 3);
          ctx.fillStyle = COLOR.danger;
          ctx.fillRect(enemy.x - width / 2, y, width * clamp(enemy.hp / enemy.maxHp, 0, 1), enemy.kind === "fort" ? 5 : 3);
        }
        if (enemy.kind === "fort" && enemy.wind > 0) this.drawFortTell(ctx, enemy);
        if (this.target === enemy) {
          ctx.strokeStyle = COLOR.cyan;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.r + 8, this.time * 2, this.time * 2 + 1.2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.r + 8, this.time * 2 + Math.PI, this.time * 2 + Math.PI + 1.2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  private drawFortTell(ctx: CanvasRenderingContext2D, enemy: Enemy) {
    const total = 0.72;
    const k = 1 - enemy.wind / total;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.strokeStyle = COLOR.danger;
    ctx.globalAlpha = 0.35 + 0.6 * k;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, enemy.r + 8 + k * 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    if (enemy.pattern % 2 === 0) {
      const base = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
      for (const off of [-0.28, 0, 0.28]) {
        const angle = base + off;
        ctx.moveTo(Math.cos(angle) * (enemy.r + 10), Math.sin(angle) * (enemy.r + 10));
        ctx.lineTo(Math.cos(angle) * (90 + k * 150), Math.sin(angle) * (90 + k * 150));
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + enemy.phase;
        ctx.moveTo(Math.cos(angle) * (enemy.r + 12), Math.sin(angle) * (enemy.r + 12));
        ctx.lineTo(Math.cos(angle) * (enemy.r + 18 + k * 64), Math.sin(angle) * (enemy.r + 18 + k * 64));
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawPlayer(ctx: CanvasRenderingContext2D) {
    if (!this.player.alive) return;
    const blink = this.player.iframe > 0 && Math.floor(this.player.iframe * 18) % 2 === 0;
    ctx.save();
    if (blink) ctx.globalAlpha = 0.45;
    if (this.boostT > 0) {
      const dx = Math.sin(this.player.rot);
      const dy = -Math.cos(this.player.rot);
      ctx.strokeStyle = "rgba(255, 176, 58, 0.45)";
      ctx.lineWidth = 2;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(this.player.x - dx * (18 + i * 8), this.player.y - dy * (18 + i * 8));
        ctx.lineTo(this.player.x - dx * (28 + i * 10), this.player.y - dy * (28 + i * 10));
        ctx.stroke();
      }
    }
    blit(ctx, this.art.player, Math.floor(this.time * 12), this.player.x, this.player.y, 78, this.player.rot);
    ctx.restore();
    if (this.shieldT > 0) {
      const alpha = 0.45 + 0.3 * Math.sin(this.time * 7);
      ctx.save();
      ctx.translate(this.player.x, this.player.y);
      ctx.rotate(this.time * 0.7);
      ctx.strokeStyle = `rgba(61, 255, 224, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * 32;
        const y = Math.sin(angle) * 32;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawFx(ctx: CanvasRenderingContext2D) {
    for (const fx of this.fxs) {
      if (!fx.alive) continue;
      const t = 1 - fx.life / fx.max;
      const frames = fx.kind === "muzzle" ? this.art.muzzle : this.art.boom;
      const frame = Math.min(frames.length - 1, Math.floor(t * frames.length));
      blit(ctx, frames, frame, fx.x, fx.y, fx.size, fx.rot);
    }
  }

  private drawParticles(ctx: CanvasRenderingContext2D) {
    for (const particle of this.particles) {
      if (!particle.alive) continue;
      ctx.globalAlpha = clamp(particle.life / particle.max, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private drawFloats(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 14px Sora, WenQuanYi Zen Hei, sans-serif";
    for (const floater of this.floats) {
      if (!floater.alive) continue;
      ctx.globalAlpha = clamp(floater.life / 0.3, 0, 1);
      ctx.fillStyle = floater.color;
      ctx.fillText(floater.text, floater.x, floater.y);
    }
    ctx.globalAlpha = 1;
  }

  private drawPointer(ctx: CanvasRenderingContext2D) {
    if (this.phase !== "play" || !this.pointer.active || this.pointer.kind === "touch") return;
    if (this.keys.size > 0) return;
    ctx.strokeStyle = COLOR.mist;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.pointer.x, this.pointer.y, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  private drawHurtVeil(ctx: CanvasRenderingContext2D) {
    if (!this.player.alive || this.player.hp >= 35 || this.phase === "menu") return;
    const alpha = (1 - this.player.hp / 35) * (0.18 + 0.08 * Math.sin(this.time * 6));
    const g = ctx.createRadialGradient(
      this.w / 2,
      this.h / 2,
      Math.min(this.w, this.h) * 0.3,
      this.w / 2,
      this.h / 2,
      Math.max(this.w, this.h) * 0.7,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, `rgba(255, 92, 77, ${alpha})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  private drawShowcase(ctx: CanvasRenderingContext2D) {
    if (this.w < 840) return;
    ctx.save();
    ctx.translate(this.w * 0.84, this.h * 0.16);
    ctx.rotate(Math.sin(this.time * 0.7) * 0.18);
    blit(ctx, this.art.player, Math.floor(this.time * 10), 0, 0, 92, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(this.w * 0.16, this.h * 0.78);
    ctx.rotate(Math.sin(this.time * 0.45) * 0.12);
    blit(ctx, this.art.fort, Math.floor(this.time * 8), 0, 0, 118, Math.sin(this.time * 0.6) * 0.2);
    ctx.restore();
  }

  private leftCount() {
    let n = this.queue.length + this.pending.length;
    for (const enemy of this.enemies) if (enemy.alive) n += 1;
    return n;
  }

  private snapshot(): Snap {
    return {
      phase: this.phase,
      hp: Math.ceil(this.player.hp),
      maxHp: MAX_HP,
      score: this.score,
      best: Math.max(this.best, this.score),
      wave: this.wave,
      left: this.phase === "play" || this.phase === "pause" || this.phase === "dying" ? this.leftCount() : 0,
      banner: this.bannerT > 0 ? this.banner : "",
      spreadTier: this.spreadTier,
      spreadT: this.spreadT,
      shieldT: this.shieldT,
      boostT: this.boostT,
      muted: this.sfx.muted,
      runId: this.runId,
      newBest: this.newBest,
      combo: this.combo,
    };
  }

  private push(force: boolean) {
    const snap = this.snapshot();
    const sig = [
      snap.phase,
      snap.hp,
      snap.score,
      snap.best,
      snap.wave,
      snap.left,
      snap.banner,
      snap.spreadTier,
      Math.round(snap.spreadT * 10),
      Math.round(snap.shieldT * 10),
      Math.round(snap.boostT * 10),
      snap.muted ? 1 : 0,
      snap.runId,
      snap.newBest ? 1 : 0,
      snap.combo,
    ].join("|");
    if (!force && sig === this.sig) return;
    this.sig = sig;
    this.onSnap(snap);
  }
}

function overlap(ax: number, ay: number, ar: number, bx: number, by: number, br: number) {
  const dx = ax - bx;
  const dy = ay - by;
  const rad = ar + br;
  return dx * dx + dy * dy <= rad * rad;
}
