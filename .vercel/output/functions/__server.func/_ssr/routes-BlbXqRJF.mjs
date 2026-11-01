import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Play, d as Keyboard, f as Crosshair, i as Trophy, l as Pause, n as VolumeX, o as Shield, r as Volume2, s as RotateCcw, t as Zap, u as MousePointer2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BlbXqRJF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLOR = {
	void: "#071018",
	panel: "#0e1c24",
	line: "#234049",
	ink: "#e7f6f2",
	mist: "#8ea8b0",
	cyan: "#3dffe0",
	amber: "#ffb03a",
	danger: "#ff5c4d",
	white: "#f7fffd"
};
function bake(size, frames, draw) {
	const sheets = [];
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
function poly(ctx, pts) {
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
function symmetric(spine) {
	const nose = spine[0];
	const keel = spine[spine.length - 1];
	if (!nose || !keel) return spine;
	const right = spine.slice(1, -1);
	const left = right.map(([x, y]) => [256 - x, y]).reverse();
	return [
		nose,
		...right,
		keel,
		...left
	];
}
function paintHull(ctx, spine, top, bottom, engine, engines, frame, cockpitY) {
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
	ctx.globalAlpha = .4 + .6 * ([
		.45,
		.72,
		1,
		.7
	][frame % 4] ?? .7);
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
function drawBolt(ctx, color, core, frame) {
	const stretch = [
		1,
		1.08,
		.94,
		1.02
	][frame % 4] ?? 1;
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
function drawFlash(ctx, frame) {
	const scales = [
		.42,
		.86,
		1.12,
		.5
	];
	const alphas = [
		.75,
		1,
		.88,
		.32
	];
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
function drawBoom(ctx, frame) {
	const radii = [
		18,
		36,
		54,
		64
	];
	const alphas = [
		1,
		.95,
		.72,
		.28
	];
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
		const angle = i / 7 * Math.PI * 2 + frame * .4;
		const dist = 12 + frame * 14;
		ctx.beginPath();
		ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 3.2, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}
function drawSpread(ctx) {
	ctx.save();
	ctx.translate(64, 70);
	ctx.fillStyle = COLOR.cyan;
	ctx.shadowColor = COLOR.cyan;
	ctx.shadowBlur = 14;
	for (const rot of [
		-.42,
		0,
		.42
	]) {
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
function drawShield(ctx) {
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
		const angle = -Math.PI / 2 + i * Math.PI / 3;
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
function chevron(ctx, y, scale, color) {
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
function drawBoost(ctx) {
	ctx.save();
	ctx.translate(64, 64);
	ctx.shadowColor = COLOR.amber;
	ctx.shadowBlur = 14;
	chevron(ctx, -16, 1, COLOR.amber);
	chevron(ctx, 8, .78, "#ffd27a");
	chevron(ctx, 28, .56, "#fff1d2");
	ctx.restore();
}
function drawMend(ctx) {
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
function drawFort(ctx, frame) {
	paintHull(ctx, [
		[128, 36],
		[168, 72],
		[214, 118],
		[196, 176],
		[156, 206],
		[128, 188]
	], "#f3d2c4", "#6e2430", COLOR.danger, [[
		108,
		168,
		8,
		16
	], [
		128,
		176,
		10,
		12
	]], frame, 104);
	ctx.save();
	ctx.shadowBlur = 0;
	ctx.fillStyle = "#1a0c10";
	ctx.fillRect(118, 48, 8, 58);
	ctx.fillRect(130, 48, 8, 58);
	ctx.fillStyle = COLOR.danger;
	ctx.shadowColor = COLOR.danger;
	ctx.shadowBlur = 10;
	ctx.globalAlpha = .55 + .45 * ([
		.55,
		.8,
		1,
		.7
	][frame % 4] ?? .8);
	ctx.beginPath();
	ctx.arc(128, 118, 11, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function createArt() {
	return {
		player: bake(256, 4, (ctx, frame) => {
			paintHull(ctx, [
				[128, 26],
				[142, 70],
				[156, 108],
				[200, 162],
				[158, 148],
				[146, 208],
				[128, 188]
			], "#f4fffc", "#0f7d74", COLOR.cyan, [[
				116,
				196,
				6,
				13
			]], frame, 96);
		}),
		scout: bake(256, 4, (ctx, frame) => {
			paintHull(ctx, [
				[128, 34],
				[150, 86],
				[196, 160],
				[144, 148],
				[128, 214]
			], "#ffd7a8", "#a62828", COLOR.amber, [[
				128,
				196,
				7,
				14
			]], frame, 108);
		}),
		gunner: bake(256, 4, (ctx, frame) => {
			paintHull(ctx, [
				[128, 48],
				[166, 84],
				[188, 142],
				[158, 156],
				[150, 208],
				[128, 192]
			], "#e7eef2", "#3a4854", COLOR.amber, [[
				118,
				190,
				6,
				12
			]], frame, 112);
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
		}),
		brute: bake(256, 4, (ctx, frame) => {
			paintHull(ctx, [
				[128, 56],
				[178, 90],
				[198, 150],
				[166, 206],
				[128, 222]
			], "#d5dee4", "#1a232a", COLOR.amber, [[
				128,
				200,
				12,
				8
			]], frame, 128);
			ctx.save();
			ctx.fillStyle = COLOR.amber;
			ctx.shadowColor = COLOR.amber;
			ctx.shadowBlur = 8;
			for (const [x, y] of [
				[178, 90],
				[198, 150],
				[166, 206]
			]) {
				ctx.beginPath();
				ctx.arc(x, y, 4.5, 0, Math.PI * 2);
				ctx.arc(256 - x, y, 4.5, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
		}),
		fort: bake(256, 4, drawFort),
		boltP: bake(128, 4, (ctx, frame) => drawBolt(ctx, COLOR.cyan, COLOR.white, frame)),
		boltE: bake(128, 4, (ctx, frame) => drawBolt(ctx, COLOR.amber, "#fff1d2", frame)),
		muzzle: bake(128, 4, drawFlash),
		boom: bake(192, 4, drawBoom),
		spread: bake(128, 1, (ctx) => drawSpread(ctx))[0],
		shield: bake(128, 1, (ctx) => drawShield(ctx))[0],
		boost: bake(128, 1, (ctx) => drawBoost(ctx))[0],
		mend: bake(128, 1, (ctx) => drawMend(ctx))[0]
	};
}
function blit(ctx, sheet, frame, x, y, size, rot = 0) {
	const img = Array.isArray(sheet) ? sheet[frame % sheet.length] : sheet;
	if (!img) return;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rot);
	ctx.drawImage(img, -size / 2, -size / 2, size, size);
	ctx.restore();
}
var Sfx = class {
	ctx = null;
	master = null;
	muted = false;
	unlock() {
		if (!this.ctx) {
			const ctx = new AudioContext();
			const master = ctx.createGain();
			master.gain.value = this.muted ? 0 : .22;
			master.connect(ctx.destination);
			this.ctx = ctx;
			this.master = master;
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	setMuted(muted) {
		this.muted = muted;
		if (this.master) this.master.gain.value = muted ? 0 : .22;
	}
	tone(freq, dur, type, gain, slide = 0) {
		if (!this.ctx || !this.master || this.muted) return;
		const t = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const amp = this.ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(48, freq + slide), t + dur);
		amp.gain.setValueAtTime(gain, t);
		amp.gain.exponentialRampToValueAtTime(.001, t + dur);
		osc.connect(amp);
		amp.connect(this.master);
		osc.start(t);
		osc.stop(t + dur + .02);
	}
	shoot() {
		this.tone(740, .05, "square", .05, -420);
	}
	hit() {
		this.tone(240, .06, "square", .05, -80);
	}
	explode() {
		this.tone(130, .22, "sawtooth", .08, -80);
	}
	hurt() {
		this.tone(180, .16, "triangle", .08, -100);
	}
	pickup() {
		this.tone(523, .07, "square", .05);
		window.setTimeout(() => this.tone(784, .09, "square", .05), 70);
	}
	wave() {
		this.tone(392, .1, "sine", .05);
		window.setTimeout(() => this.tone(587, .14, "sine", .05), 90);
	}
	warn() {
		this.tone(96, .26, "sawtooth", .07, -28);
		window.setTimeout(() => this.tone(144, .18, "square", .045), 140);
	}
};
var KEY = "deep-void-hunter-v1";
var NAME_KEY = "deep-void-hunter-name";
var MUTE_KEY = "deep-void-hunter-mute";
function read() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const data = JSON.parse(raw);
		if (data.version !== 1 || !Array.isArray(data.rows)) return [];
		return data.rows.filter((row) => row && typeof row.score === "number" && typeof row.ts === "number").slice(0, 8);
	} catch {
		return [];
	}
}
function write(rows) {
	const file = {
		version: 1,
		rows: rows.slice(0, 8)
	};
	localStorage.setItem(KEY, JSON.stringify(file));
}
function cleanName(name) {
	return name.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 8) || "ACE";
}
function loadScores() {
	return read().sort((a, b) => b.score - a.score || a.ts - b.ts);
}
function loadBest() {
	return loadScores()[0]?.score ?? 0;
}
function loadName() {
	try {
		return cleanName(localStorage.getItem(NAME_KEY) || "ACE");
	} catch {
		return "ACE";
	}
}
function loadMute() {
	try {
		return localStorage.getItem(MUTE_KEY) === "1";
	} catch {
		return false;
	}
}
function saveMute(muted) {
	try {
		localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
	} catch {}
}
function recordScore(row) {
	const rows = loadScores();
	rows.push(row);
	rows.sort((a, b) => b.score - a.score || a.ts - b.ts);
	const top = rows.slice(0, 8);
	try {
		write(top);
		localStorage.setItem(NAME_KEY, cleanName(row.name));
	} catch {}
	return top;
}
function renameScore(ts, name) {
	const next = cleanName(name);
	const rows = loadScores();
	const row = rows.find((item) => item.ts === ts);
	if (row) row.name = next;
	try {
		write(rows);
		localStorage.setItem(NAME_KEY, next);
	} catch {}
	return rows;
}
var STAT = {
	scout: {
		hp: 28,
		speed: 168,
		r: 13,
		score: 120,
		touch: 10,
		size: 58
	},
	gunner: {
		hp: 52,
		speed: 112,
		r: 16,
		score: 220,
		touch: 14,
		size: 66
	},
	brute: {
		hp: 130,
		speed: 74,
		r: 24,
		score: 460,
		touch: 22,
		size: 84
	},
	fort: {
		hp: 720,
		speed: 46,
		r: 42,
		score: 1800,
		touch: 18,
		size: 132
	}
};
var MEND = "#7dffb2";
var MAX_HP = 100;
function comboMultiplier(combo) {
	if (combo < 3) return 1;
	if (combo < 8) return 2;
	if (combo < 15) return 3;
	return 4;
}
function clamp(v, min, max) {
	return Math.max(min, Math.min(max, v));
}
function dampAngle(current, target, dt, rate) {
	return current + Math.atan2(Math.sin(target - current), Math.cos(target - current)) * (1 - Math.exp(-rate * dt));
}
function take(list, make) {
	for (const item of list) if (!item.alive) return item;
	const item = make();
	list.push(item);
	return item;
}
function composeWave(wave) {
	if (wave > 0 && wave % 5 === 0) return ["fort"];
	const out = [];
	const scouts = Math.min(8, 3 + wave);
	const gunners = wave >= 2 ? Math.min(6, wave) : 0;
	const brutes = wave >= 3 ? Math.min(3, Math.floor((wave - 1) / 2)) : 0;
	for (let i = 0; i < scouts; i++) out.push("scout");
	for (let i = 0; i < gunners; i++) out.push("gunner");
	for (let i = 0; i < brutes; i++) out.push("brute");
	return out;
}
var Sim = class {
	canvas;
	ctx;
	art;
	sfx = new Sfx();
	raf = 0;
	acc = 0;
	last = 0;
	time = 0;
	w = 1;
	h = 1;
	dpr = 1;
	reduce;
	ro;
	keys = /* @__PURE__ */ new Set();
	pointer = {
		x: 0,
		y: 0,
		active: false,
		down: false,
		kind: "mouse"
	};
	phase = "menu";
	player = {
		x: 0,
		y: 0,
		vx: 0,
		vy: 0,
		rot: 0,
		hp: MAX_HP,
		iframe: 0,
		fire: 0,
		trail: 0,
		alive: false
	};
	lastYaw = 0;
	enemies = [];
	bullets = [];
	pickups = [];
	particles = [];
	floats = [];
	fxs = [];
	stars = [];
	pending = [];
	queue = [];
	wave = 1;
	spawnCd = 0;
	gap = -1;
	announcedNext = false;
	score = 0;
	best = 0;
	bestAtStart = 0;
	celebrated = false;
	newBest = false;
	banner = "";
	bannerT = 0;
	spreadTier = 0;
	spreadT = 0;
	shieldT = 0;
	boostT = 0;
	combo = 0;
	comboT = 0;
	runId = 0;
	dyingT = 0;
	shake = 0;
	shakeX = 0;
	shakeY = 0;
	nebula = null;
	vignette = null;
	sig = "";
	target = null;
	aimX = 0;
	aimY = -1;
	onSnap;
	onKeyDown;
	onKeyUp;
	onBlur;
	onVis;
	onDown;
	onMove;
	onUp;
	onLeave;
	constructor(canvas, opts) {
		this.canvas = canvas;
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
		this.spawnCd = .85;
		this.gap = -1;
		this.announcedNext = false;
		this.dyingT = 0;
		this.shake = 0;
		this.target = null;
		this.aimX = 0;
		this.aimY = -1;
		this.lastYaw = 0;
		for (const list of [
			this.enemies,
			this.bullets,
			this.pickups,
			this.particles,
			this.floats,
			this.fxs
		]) for (const item of list) item.alive = false;
		this.player = {
			x: this.w / 2,
			y: this.h * .72,
			vx: 0,
			vy: 0,
			rot: 0,
			hp: MAX_HP,
			iframe: 0,
			fire: .25,
			trail: 0,
			alive: true
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
	setMuted(muted) {
		this.sfx.setMuted(muted);
		saveMute(muted);
		this.push(true);
	}
	setKeys(codes) {
		this.keys.clear();
		for (const code of codes) this.keys.add(code);
		this.pointer.active = false;
		this.pointer.down = false;
	}
	getMovementYaw() {
		if (Math.hypot(this.player.vx, this.player.vy) < 12) return this.lastYaw;
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
	handleKeyDown(e) {
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
	pointerDown(e) {
		this.sfx.unlock();
		this.readPointer(e);
		this.pointer.active = true;
		this.pointer.down = true;
	}
	pointerMove(e) {
		this.readPointer(e);
		if (e.pointerType === "mouse" || this.pointer.down) this.pointer.active = true;
	}
	pointerUp(e) {
		this.pointer.down = false;
		if (e.pointerType !== "mouse") this.pointer.active = false;
	}
	pointerLeave(e) {
		if (!this.pointer.down) this.pointer.active = false;
		if (e.pointerType !== "mouse") this.pointer.active = false;
	}
	readPointer(e) {
		const rect = this.canvas.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		if (e.pointerType === "touch") y -= 78;
		this.pointer.kind = e.pointerType;
		this.pointer.x = clamp(x, 18, Math.max(18, this.w - 18));
		this.pointer.y = clamp(y, 18, Math.max(18, this.h - 18));
	}
	resize() {
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
			this.player.y = h * .72;
		}
	}
	ensureStars() {
		const count = clamp(Math.round(this.w * this.h / 11e3), 48, 150);
		const colors = [
			COLOR.white,
			COLOR.mist,
			COLOR.cyan,
			COLOR.amber
		];
		while (this.stars.length < count) {
			const depth = this.stars.length % 3 === 0 ? .7 : this.stars.length % 3 === 1 ? .35 : .12;
			this.stars.push({
				x: Math.random() * this.w,
				y: Math.random() * this.h,
				r: depth > .5 ? 2.1 : depth > .2 ? 1.5 : 1,
				a: .35 + depth * .55,
				depth,
				drift: 10 + depth * 46,
				tw: Math.random() * 10,
				twSpeed: .8 + Math.random() * 1.8,
				color: colors[Math.floor(Math.random() * (depth > .5 ? 4 : 2))] ?? COLOR.white,
				spark: depth > .5 && Math.random() > .72
			});
		}
		if (this.stars.length > count) this.stars.length = count;
	}
	bakeBackdrop() {
		const nebula = document.createElement("canvas");
		nebula.width = Math.max(2, Math.ceil(this.w * 1.5));
		nebula.height = Math.max(2, Math.ceil(this.h * 1.5));
		const ng = nebula.getContext("2d");
		if (ng) {
			ng.fillStyle = COLOR.void;
			ng.fillRect(0, 0, nebula.width, nebula.height);
			const blob = (x, y, r, color) => {
				const g = ng.createRadialGradient(x, y, 0, x, y, r);
				g.addColorStop(0, color);
				g.addColorStop(1, "rgba(0,0,0,0)");
				ng.fillStyle = g;
				ng.beginPath();
				ng.arc(x, y, r, 0, Math.PI * 2);
				ng.fill();
			};
			blob(nebula.width * .32, nebula.height * .38, nebula.width * .38, "rgba(61,255,224,0.10)");
			blob(nebula.width * .72, nebula.height * .62, nebula.width * .32, "rgba(255,176,58,0.06)");
			blob(nebula.width * .5, nebula.height * .2, nebula.width * .22, "rgba(20,70,82,0.45)");
		}
		this.nebula = nebula;
		const vignette = document.createElement("canvas");
		vignette.width = Math.max(2, Math.ceil(this.w));
		vignette.height = Math.max(2, Math.ceil(this.h));
		const vg = vignette.getContext("2d");
		if (vg) {
			const g = vg.createRadialGradient(this.w / 2, this.h / 2, Math.min(this.w, this.h) * .2, this.w / 2, this.h / 2, Math.max(this.w, this.h) * .68);
			g.addColorStop(0, "rgba(0,0,0,0)");
			g.addColorStop(1, "rgba(0,0,0,0.55)");
			vg.fillStyle = g;
			vg.fillRect(0, 0, this.w, this.h);
		}
		this.vignette = vignette;
	}
	frame(now) {
		const raw = Math.min(.1, (now - this.last) / 1e3);
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
	hitStop = 0;
	hitStopActive(raw) {
		if (this.hitStop <= 0 || this.reduce || this.phase !== "play") return false;
		this.hitStop -= raw;
		return true;
	}
	update(dt) {
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
		this.shakeX = (Math.random() - .5) * this.shake * 2;
		this.shakeY = (Math.random() - .5) * this.shake * 2;
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
	tickBuffs(dt) {
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
	movePlayer(dt) {
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
			dx = ix / keyMag * max;
			dy = iy / keyMag * max;
		} else if (this.pointer.active) {
			const px = this.pointer.x - this.player.x;
			const py = this.pointer.y - this.player.y;
			const dist = Math.hypot(px, py);
			if (dist > 6) {
				const want = Math.min(max, dist * 6.5);
				dx = px / dist * want;
				dy = py / dist * want;
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
	updateSpawns(dt) {
		if (this.gap >= 0) return;
		this.spawnCd -= dt;
		if (this.queue.length > 0 && this.spawnCd <= 0) {
			const kind = this.queue.shift();
			if (kind) {
				const point = this.edgePoint();
				this.pending.push({
					kind,
					x: point.x,
					y: point.y,
					t: .42
				});
			}
			this.spawnCd = Math.max(.32, .78 - this.wave * .03);
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
	edgePoint() {
		const minDist = Math.min(190, Math.min(this.w, this.h) * .42);
		let best = {
			x: this.w / 2,
			y: 12
		};
		let bestD = -1;
		for (let i = 0; i < 8; i++) {
			const side = Math.floor(Math.random() * 4);
			const m = 10;
			const point = side === 0 ? {
				x: m + Math.random() * (this.w - 20),
				y: m
			} : side === 1 ? {
				x: this.w - m,
				y: m + Math.random() * (this.h - 20)
			} : side === 2 ? {
				x: m + Math.random() * (this.w - 20),
				y: this.h - m
			} : {
				x: m,
				y: m + Math.random() * (this.h - 20)
			};
			const d = Math.hypot(point.x - this.player.x, point.y - this.player.y);
			if (d > bestD) {
				best = point;
				bestD = d;
			}
			if (d >= minDist) return point;
		}
		return best;
	}
	birth(spawn) {
		const stat = STAT[spawn.kind];
		const scale = spawn.kind === "fort" ? 1 + Math.max(0, Math.floor(this.wave / 5) - 1) * .28 : 1 + (this.wave - 1) * .055;
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
		enemy.cool = spawn.kind === "fort" ? 1.15 : .55 + Math.random() * .9;
		enemy.phase = Math.random() * Math.PI * 2;
		enemy.score = stat.score + this.wave * 8;
		enemy.touch = stat.touch;
		enemy.speed = stat.speed * (1 + Math.min(.45, (this.wave - 1) * .035));
		enemy.size = stat.size;
		enemy.rot = 0;
		enemy.wind = 0;
		enemy.pattern = 0;
		if (spawn.kind === "fort") {
			this.setBanner("要塞来袭", 1.5);
			this.sfx.warn();
		}
	}
	blankEnemy() {
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
			pattern: 0
		};
	}
	updateEnemies(dt) {
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
				if (d2 > 0 && d2 < 2304) {
					const d = Math.sqrt(d2);
					sx += ox / d;
					sy += oy / d;
				}
			}
			let steerX = nx;
			let steerY = ny;
			if (enemy.kind === "scout") {
				const strafe = Math.sin(this.time * 3.1 + enemy.phase);
				steerX = nx - ny * strafe * .9;
				steerY = ny + nx * strafe * .9;
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
					enemy.cool = Math.max(.7, 1.45 - this.wave * .045);
					this.enemyShot(enemy, dx, dy, {
						speed: 250 + this.wave * 6,
						dmg: 12,
						r: 6,
						life: 2.4
					});
				}
			} else if (enemy.kind === "brute" && dist < 500) {
				enemy.cool -= dt;
				if (enemy.cool <= 0) {
					enemy.cool = Math.max(1.7, 2.5 - this.wave * .04);
					this.enemyShot(enemy, dx, dy, {
						speed: 168,
						dmg: 16,
						r: 9,
						life: 2.8
					});
				}
			}
			steerX += sx * .85;
			steerY += sy * .85;
			const mag = Math.hypot(steerX, steerY) || 1;
			const tvx = steerX / mag * enemy.speed;
			const tvy = steerY / mag * enemy.speed;
			const k = Math.min(1, dt * 3.2);
			enemy.vx += (tvx - enemy.vx) * k;
			enemy.vy += (tvy - enemy.vy) * k;
			enemy.x += enemy.vx * dt;
			enemy.y += enemy.vy * dt;
			enemy.rot = dampAngle(enemy.rot, Math.atan2(nx, -ny), dt, 7);
		}
	}
	stepFort(enemy, dt, nx, ny) {
		const orbitX = this.w * .5 + Math.sin(this.time * .35 + enemy.phase) * Math.min(160, this.w * .18);
		const orbitY = Math.min(this.h * .34, 210) + Math.cos(this.time * .28) * 18;
		let steerX = orbitX - enemy.x;
		let steerY = orbitY - enemy.y;
		const mag = Math.hypot(steerX, steerY) || 1;
		const pace = enemy.wind > 0 ? .35 : 1;
		const tvx = steerX / mag * enemy.speed * pace;
		const tvy = steerY / mag * enemy.speed * pace;
		const k = Math.min(1, dt * 2.2);
		enemy.vx += (tvx - enemy.vx) * k;
		enemy.vy += (tvy - enemy.vy) * k;
		enemy.x = clamp(enemy.x + enemy.vx * dt, enemy.r + 8, this.w - enemy.r - 8);
		enemy.y = clamp(enemy.y + enemy.vy * dt, enemy.r + 8, this.h * .62);
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
			enemy.wind = .72;
			this.sfx.warn();
		}
	}
	enemyShot(enemy, dx, dy, shot) {
		const base = Math.atan2(dy, dx) + (Math.random() - .5) * .08;
		this.launchEnemy(enemy, base, shot.speed, shot.dmg, shot.r, shot.life);
	}
	fanShot(enemy) {
		const base = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
		for (const off of [
			-.28,
			0,
			.28
		]) this.launchEnemy(enemy, base + off, 280, 13, 6, 2.6);
	}
	ringShot(enemy) {
		const count = 12;
		for (let i = 0; i < count; i++) {
			const angle = i / count * Math.PI * 2 + enemy.phase;
			this.launchEnemy(enemy, angle, 148, 11, 7, 3.3);
		}
	}
	launchEnemy(enemy, angle, speed, dmg, r, life) {
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
	aimAndFire(dt) {
		let best = null;
		let bestD = Infinity;
		const range = Math.max(300, Math.min(this.w, this.h) * .78);
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
		if ((this.keys.has("Space") || this.pointer.down || Boolean(best)) && this.player.fire <= 0 && this.player.alive) this.fire();
	}
	fire() {
		const count = this.spreadTier <= 0 ? 1 : this.spreadTier === 1 ? 3 : 5;
		const arc = this.spreadTier <= 0 ? 0 : this.spreadTier === 1 ? .2 : .18;
		const dmg = this.spreadTier <= 0 ? 18 : this.spreadTier === 1 ? 13 : 11;
		const base = Math.atan2(this.aimY, this.aimX);
		for (let i = 0; i < count; i++) {
			const angle = base + (count === 1 ? 0 : (i / (count - 1) - .5) * 2) * arc;
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
		this.player.fire = .15;
		this.shake = Math.min(5, this.shake + (this.reduce ? 0 : 1.2));
		this.sfx.shoot();
	}
	makeBullet() {
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
			friendly: true
		}));
		bullet.alive = true;
		return bullet;
	}
	updateBullets(dt) {
		const margin = 48;
		for (const bullet of this.bullets) {
			if (!bullet.alive) continue;
			bullet.life -= dt;
			bullet.x += bullet.vx * dt;
			bullet.y += bullet.vy * dt;
			if (bullet.life <= 0 || bullet.x < -48 || bullet.y < -48 || bullet.x > this.w + margin || bullet.y > this.h + margin) bullet.alive = false;
		}
	}
	collide() {
		for (const bullet of this.bullets) {
			if (!bullet.alive || !bullet.friendly) continue;
			for (const enemy of this.enemies) {
				if (!enemy.alive) continue;
				if (!overlap(bullet.x, bullet.y, bullet.r, enemy.x, enemy.y, enemy.r)) continue;
				bullet.alive = false;
				enemy.hp -= bullet.dmg;
				enemy.flash = .08;
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
			enemy.x += dx / dist * 16;
			enemy.y += dy / dist * 16;
			this.hurt(enemy.touch);
		}
	}
	hurt(dmg) {
		if (!this.player.alive || this.player.iframe > 0) return;
		if (this.shieldT > 0) {
			this.player.iframe = .18;
			this.burst(this.player.x, this.player.y, COLOR.cyan, 8, 140);
			this.shake = Math.min(6, this.shake + (this.reduce ? 0 : 2));
			this.sfx.hit();
			return;
		}
		this.player.hp = Math.max(0, this.player.hp - dmg);
		this.player.iframe = .7;
		this.float(`-${dmg}`, this.player.x, this.player.y - 18, COLOR.danger);
		this.burst(this.player.x, this.player.y, COLOR.danger, 8, 120);
		this.shake = Math.min(8, this.shake + (this.reduce ? 0 : 4));
		this.sfx.hurt();
		if (this.player.hp <= 0) this.killPlayer();
	}
	killEnemy(enemy) {
		enemy.alive = false;
		this.combo += 1;
		this.comboT = 2.15;
		const mult = comboMultiplier(this.combo);
		this.addScore(enemy.score * mult, enemy.x, enemy.y - 16);
		if (mult > 1 && (this.combo === 3 || this.combo === 8 || this.combo === 15)) this.float(`×${mult}`, enemy.x, enemy.y - 36, COLOR.amber);
		this.boom(enemy.x, enemy.y, enemy.kind === "fort" ? 168 : enemy.size * 1.15);
		this.burst(enemy.x, enemy.y, enemy.kind === "scout" ? COLOR.amber : COLOR.danger, enemy.kind === "fort" ? 26 : 14, 180);
		this.sfx.explode();
		if (!this.reduce) this.hitStop = Math.max(this.hitStop, enemy.kind === "fort" ? .09 : .04);
		this.shake = Math.min(enemy.kind === "fort" ? 10 : 7, this.shake + (this.reduce ? 0 : enemy.kind === "fort" ? 6 : 3.5));
		if (enemy.kind === "fort") {
			this.drop(enemy.x - 36, enemy.y, "spread");
			this.drop(enemy.x + 36, enemy.y, "shield");
			this.drop(enemy.x, enemy.y + 28, "mend");
			return;
		}
		if (this.livePickups() < 4 && Math.random() < .36) {
			const roll = Math.random();
			const kind = roll < .32 ? "spread" : roll < .58 ? "shield" : roll < .84 ? "boost" : "mend";
			this.drop(enemy.x, enemy.y, kind);
		}
	}
	killPlayer() {
		this.player.alive = false;
		this.player.hp = 0;
		this.boom(this.player.x, this.player.y, 110);
		this.burst(this.player.x, this.player.y, COLOR.cyan, 18, 220);
		this.phase = "dying";
		this.dyingT = .72;
		this.sfx.explode();
		this.shake = this.reduce ? 0 : 8;
		this.push(true);
	}
	drop(x, y, kind = "spread") {
		const pickup = take(this.pickups, () => ({
			alive: false,
			kind: "spread",
			x: 0,
			y: 0,
			life: 0,
			bob: 0
		}));
		pickup.alive = true;
		pickup.kind = kind;
		pickup.x = clamp(x, 24, this.w - 24);
		pickup.y = clamp(y, 24, this.h - 24);
		pickup.life = 12;
		pickup.bob = Math.random() * Math.PI * 2;
	}
	livePickups() {
		let n = 0;
		for (const pickup of this.pickups) if (pickup.alive) n += 1;
		return n;
	}
	updatePickups(dt) {
		for (const pickup of this.pickups) {
			if (!pickup.alive) continue;
			pickup.life -= dt;
			pickup.bob += dt * 3;
			const dx = this.player.x - pickup.x;
			const dy = this.player.y - pickup.y;
			const dist = Math.hypot(dx, dy) || 1;
			if (dist < 120) {
				pickup.x += dx / dist * 120 * dt;
				pickup.y += dy / dist * 120 * dt;
			}
			if (pickup.life <= 0) pickup.alive = false;
			else if (this.player.alive && dist < 28) this.collect(pickup);
		}
	}
	collect(pickup) {
		pickup.alive = false;
		if (pickup.kind === "spread") {
			this.spreadTier = Math.min(2, this.spreadTier + 1);
			this.spreadT = 9;
			this.setBanner(this.spreadTier >= 2 ? "五重射击" : "多重射击", .9);
		} else if (pickup.kind === "shield") {
			this.shieldT = 6.5;
			this.setBanner("护盾", .9);
		} else if (pickup.kind === "boost") {
			this.boostT = 7;
			this.setBanner("加速", .9);
		} else {
			const before = this.player.hp;
			this.player.hp = Math.min(MAX_HP, this.player.hp + 28);
			const healed = Math.round(this.player.hp - before);
			this.float(healed > 0 ? `+${healed}` : "满血", this.player.x, this.player.y - 20, MEND);
			this.setBanner("修复", .9);
		}
		const burstColor = pickup.kind === "boost" ? COLOR.amber : pickup.kind === "mend" ? MEND : COLOR.cyan;
		this.burst(pickup.x, pickup.y, burstColor, 10, 120);
		this.sfx.pickup();
	}
	maybeClearWave(dt) {
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
			this.spawnCd = .35;
		}
	}
	addScore(n, x, y) {
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
	setBanner(text, time) {
		this.banner = text;
		this.bannerT = time;
	}
	updateStars(dt) {
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
	engineTrail(dt) {
		const speed = Math.hypot(this.player.vx, this.player.vy);
		if (!this.player.alive || speed < 48) return;
		this.player.trail -= dt;
		if (this.player.trail > 0) return;
		this.player.trail = this.boostT > 0 ? .02 : .035;
		const dx = Math.sin(this.player.rot);
		const dy = -Math.cos(this.player.rot);
		this.burst(this.player.x - dx * 18, this.player.y - dy * 18, this.boostT > 0 ? COLOR.amber : COLOR.cyan, 1, 40);
	}
	burst(x, y, color, n, speed) {
		let live = 0;
		for (const particle of this.particles) if (particle.alive) live += 1;
		for (let i = 0; i < n; i++) {
			if (live > 200) return;
			const angle = Math.random() * Math.PI * 2;
			const vel = speed * (.35 + Math.random());
			const particle = take(this.particles, () => ({
				alive: false,
				x: 0,
				y: 0,
				vx: 0,
				vy: 0,
				life: 0,
				max: 1,
				size: 2,
				color
			}));
			particle.alive = true;
			particle.x = x;
			particle.y = y;
			particle.vx = Math.cos(angle) * vel;
			particle.vy = Math.sin(angle) * vel;
			particle.max = .28 + Math.random() * .32;
			particle.life = particle.max;
			particle.size = 1.4 + Math.random() * 2.2;
			particle.color = color;
			live += 1;
		}
	}
	muzzle(x, y, rot, size) {
		const fx = take(this.fxs, () => this.blankFx());
		fx.alive = true;
		fx.kind = "muzzle";
		fx.x = x;
		fx.y = y;
		fx.rot = rot;
		fx.max = .09;
		fx.life = fx.max;
		fx.size = size;
	}
	boom(x, y, size) {
		const fx = take(this.fxs, () => this.blankFx());
		fx.alive = true;
		fx.kind = "boom";
		fx.x = x;
		fx.y = y;
		fx.rot = Math.random() * Math.PI;
		fx.max = .42;
		fx.life = fx.max;
		fx.size = size;
	}
	blankFx() {
		return {
			alive: false,
			kind: "boom",
			x: 0,
			y: 0,
			rot: 0,
			life: 0,
			max: 1,
			size: 40
		};
	}
	updateFx(dt) {
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
	float(text, x, y, color) {
		const floater = take(this.floats, () => ({
			alive: false,
			x: 0,
			y: 0,
			vy: -36,
			life: 0,
			text: "",
			color
		}));
		floater.alive = true;
		floater.x = x;
		floater.y = y;
		floater.vy = -42;
		floater.life = .7;
		floater.text = text;
		floater.color = color;
	}
	render() {
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
	drawBackdrop(ctx) {
		ctx.fillStyle = COLOR.void;
		ctx.fillRect(-20, -20, this.w + 40, this.h + 40);
		if (!this.nebula) return;
		const moving = this.phase !== "menu";
		const px = moving ? this.player.x : this.w / 2;
		const py = moving ? this.player.y : this.h / 2;
		const maxX = Math.max(0, this.nebula.width - this.w);
		const maxY = Math.max(0, this.nebula.height - this.h);
		const sx = clamp(maxX * (.45 + .08 * Math.sin(this.time * .05)) + (px - this.w / 2) * .08, 0, maxX);
		const sy = clamp(this.time * 14 % (maxY + 1) + (py - this.h / 2) * .08, 0, maxY);
		ctx.drawImage(this.nebula, sx, sy, this.w, this.h, 0, 0, this.w, this.h);
	}
	drawStars(ctx) {
		for (const star of this.stars) {
			const tw = .55 + .45 * Math.sin(star.tw);
			ctx.globalAlpha = star.a * tw;
			ctx.fillStyle = star.color;
			ctx.fillRect(star.x, star.y, star.r, star.r);
			if (star.spark) {
				ctx.fillRect(star.x - 2.5, star.y + star.r / 2 - .4, 6, .8);
				ctx.fillRect(star.x + star.r / 2 - .4, star.y - 2.5, .8, 6);
			}
		}
		ctx.globalAlpha = 1;
	}
	drawSpawns(ctx) {
		for (const spawn of this.pending) {
			const k = 1 - spawn.t / .42;
			ctx.save();
			ctx.globalAlpha = .35 + k * .5;
			ctx.strokeStyle = COLOR.danger;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(spawn.x, spawn.y, 8 + k * 16, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();
		}
	}
	drawPickups(ctx) {
		for (const pickup of this.pickups) {
			if (!pickup.alive) continue;
			const blink = pickup.life < 2.6 ? .45 + .55 * Math.sin(this.time * 14) : 1;
			const icon = pickup.kind === "spread" ? this.art.spread : pickup.kind === "shield" ? this.art.shield : pickup.kind === "boost" ? this.art.boost : this.art.mend;
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
	drawBullets(ctx, friendly) {
		const sheet = friendly ? this.art.boltP : this.art.boltE;
		const frame = Math.floor(this.time * 16) % 4;
		for (const bullet of this.bullets) {
			if (!bullet.alive || bullet.friendly !== friendly) continue;
			ctx.save();
			ctx.globalAlpha = .45;
			ctx.strokeStyle = friendly ? COLOR.cyan : COLOR.amber;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(bullet.x, bullet.y);
			ctx.lineTo(bullet.x - bullet.vx * .028, bullet.y - bullet.vy * .028);
			ctx.stroke();
			ctx.restore();
			blit(ctx, sheet, frame, bullet.x, bullet.y, friendly ? 36 : 32, Math.atan2(bullet.vx, -bullet.vy));
		}
	}
	drawEnemies(ctx) {
		for (const kind of [
			"brute",
			"gunner",
			"scout",
			"fort"
		]) for (const enemy of this.enemies) {
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
				ctx.globalAlpha = .8;
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
	drawFortTell(ctx, enemy) {
		const k = 1 - enemy.wind / .72;
		ctx.save();
		ctx.translate(enemy.x, enemy.y);
		ctx.strokeStyle = COLOR.danger;
		ctx.globalAlpha = .35 + .6 * k;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(0, 0, enemy.r + 8 + k * 16, 0, Math.PI * 2);
		ctx.stroke();
		ctx.beginPath();
		if (enemy.pattern % 2 === 0) {
			const base = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
			for (const off of [
				-.28,
				0,
				.28
			]) {
				const angle = base + off;
				ctx.moveTo(Math.cos(angle) * (enemy.r + 10), Math.sin(angle) * (enemy.r + 10));
				ctx.lineTo(Math.cos(angle) * (90 + k * 150), Math.sin(angle) * (90 + k * 150));
			}
		} else for (let i = 0; i < 12; i++) {
			const angle = i / 12 * Math.PI * 2 + enemy.phase;
			ctx.moveTo(Math.cos(angle) * (enemy.r + 12), Math.sin(angle) * (enemy.r + 12));
			ctx.lineTo(Math.cos(angle) * (enemy.r + 18 + k * 64), Math.sin(angle) * (enemy.r + 18 + k * 64));
		}
		ctx.stroke();
		ctx.restore();
	}
	drawPlayer(ctx) {
		if (!this.player.alive) return;
		const blink = this.player.iframe > 0 && Math.floor(this.player.iframe * 18) % 2 === 0;
		ctx.save();
		if (blink) ctx.globalAlpha = .45;
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
			const alpha = .45 + .3 * Math.sin(this.time * 7);
			ctx.save();
			ctx.translate(this.player.x, this.player.y);
			ctx.rotate(this.time * .7);
			ctx.strokeStyle = `rgba(61, 255, 224, ${alpha})`;
			ctx.lineWidth = 2;
			ctx.beginPath();
			for (let i = 0; i < 6; i++) {
				const angle = i * Math.PI / 3;
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
	drawFx(ctx) {
		for (const fx of this.fxs) {
			if (!fx.alive) continue;
			const t = 1 - fx.life / fx.max;
			const frames = fx.kind === "muzzle" ? this.art.muzzle : this.art.boom;
			blit(ctx, frames, Math.min(frames.length - 1, Math.floor(t * frames.length)), fx.x, fx.y, fx.size, fx.rot);
		}
	}
	drawParticles(ctx) {
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
	drawFloats(ctx) {
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = "600 14px Sora, WenQuanYi Zen Hei, sans-serif";
		for (const floater of this.floats) {
			if (!floater.alive) continue;
			ctx.globalAlpha = clamp(floater.life / .3, 0, 1);
			ctx.fillStyle = floater.color;
			ctx.fillText(floater.text, floater.x, floater.y);
		}
		ctx.globalAlpha = 1;
	}
	drawPointer(ctx) {
		if (this.phase !== "play" || !this.pointer.active || this.pointer.kind === "touch") return;
		if (this.keys.size > 0) return;
		ctx.strokeStyle = COLOR.mist;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(this.pointer.x, this.pointer.y, 8, 0, Math.PI * 2);
		ctx.stroke();
	}
	drawHurtVeil(ctx) {
		if (!this.player.alive || this.player.hp >= 35 || this.phase === "menu") return;
		const alpha = (1 - this.player.hp / 35) * (.18 + .08 * Math.sin(this.time * 6));
		const g = ctx.createRadialGradient(this.w / 2, this.h / 2, Math.min(this.w, this.h) * .3, this.w / 2, this.h / 2, Math.max(this.w, this.h) * .7);
		g.addColorStop(0, "rgba(0,0,0,0)");
		g.addColorStop(1, `rgba(255, 92, 77, ${alpha})`);
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, this.w, this.h);
	}
	drawShowcase(ctx) {
		if (this.w < 840) return;
		ctx.save();
		ctx.translate(this.w * .84, this.h * .16);
		ctx.rotate(Math.sin(this.time * .7) * .18);
		blit(ctx, this.art.player, Math.floor(this.time * 10), 0, 0, 92, 0);
		ctx.restore();
		ctx.save();
		ctx.translate(this.w * .16, this.h * .78);
		ctx.rotate(Math.sin(this.time * .45) * .12);
		blit(ctx, this.art.fort, Math.floor(this.time * 8), 0, 0, 118, Math.sin(this.time * .6) * .2);
		ctx.restore();
	}
	leftCount() {
		let n = this.queue.length + this.pending.length;
		for (const enemy of this.enemies) if (enemy.alive) n += 1;
		return n;
	}
	snapshot() {
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
			combo: this.combo
		};
	}
	push(force) {
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
			snap.combo
		].join("|");
		if (!force && sig === this.sig) return;
		this.sig = sig;
		this.onSnap(snap);
	}
};
function overlap(ax, ay, ar, bx, by, br) {
	const dx = ax - bx;
	const dy = ay - by;
	const rad = ar + br;
	return dx * dx + dy * dy <= rad * rad;
}
var INITIAL = {
	phase: "menu",
	hp: 100,
	maxHp: 100,
	score: 0,
	best: 0,
	wave: 1,
	left: 0,
	banner: "",
	spreadTier: 0,
	spreadT: 0,
	shieldT: 0,
	boostT: 0,
	muted: false,
	runId: 0,
	newBest: false,
	combo: 0
};
var primaryBtn = "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cyan px-6 text-base font-semibold text-void transition-colors duration-200 hover:bg-cyan/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";
var ghostBtn = "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-void/70 px-5 text-base font-medium text-ink transition-colors duration-200 hover:border-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";
function SpaceShooter() {
	const canvasRef = (0, import_react.useRef)(null);
	const simRef = (0, import_react.useRef)(null);
	const savedRun = (0, import_react.useRef)(0);
	const [snap, setSnap] = (0, import_react.useState)(INITIAL);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [name, setName] = (0, import_react.useState)("ACE");
	const [editTs, setEditTs] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const sim = new Sim(canvas, { onSnap: (next) => {
			setSnap(next);
			if (next.phase === "over" && savedRun.current !== next.runId) {
				savedRun.current = next.runId;
				const row = {
					name: loadName(),
					score: next.score,
					wave: next.wave,
					ts: Date.now()
				};
				setRows(recordScore(row));
				setEditTs(row.ts);
				setName(row.name);
			}
		} });
		simRef.current = sim;
		setRows(loadScores());
		if (new URLSearchParams(window.location.search).has("qa")) window.__controlsTest = {
			getYaw: () => sim.getMovementYaw(),
			getSpeed: () => sim.getSpeed(),
			setKeys: (codes) => sim.setKeys(codes),
			getX: () => sim.getX(),
			getY: () => sim.getY()
		};
		return () => {
			sim.destroy();
			simRef.current = null;
			delete window.__controlsTest;
		};
	}, []);
	const playing = snap.phase === "play" || snap.phase === "dying" || snap.phase === "pause";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-void text-ink select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full touch-none",
				"aria-label": "深空猎手游戏画面"
			}),
			snap.phase !== "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: "深空猎手"
			}) : null,
			playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {
				snap,
				onPause: () => simRef.current?.togglePause()
			}) : null,
			snap.banner && playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-1/3 flex justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rise-in text-3xl font-semibold tracking-wide text-ink",
					children: snap.banner
				})
			}) : null,
			snap.phase === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
				rows,
				best: Math.max(snap.best, rows[0]?.score ?? 0),
				muted: snap.muted,
				onStart: () => simRef.current?.start(),
				onMute: () => simRef.current?.setMuted(!snap.muted)
			}) : null,
			snap.phase === "pause" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Overlay, {
				onBackdrop: () => simRef.current?.resume(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-semibold",
						children: "已暂停"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-mist",
						children: "Esc 或 P 继续。返回标题不记分。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: primaryBtn,
								onClick: () => simRef.current?.resume(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "继续"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: ghostBtn,
								onClick: () => simRef.current?.start(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "重新开始"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: ghostBtn,
								onClick: () => simRef.current?.quitToMenu(),
								children: "返回标题"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: ghostBtn,
								onClick: () => simRef.current?.setMuted(!snap.muted),
								children: [snap.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }), snap.muted ? "打开音效" : "关闭音效"]
							})
						]
					})
				]
			}) : null,
			snap.phase === "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Overlay, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm tracking-widest text-danger",
					children: "船体解体"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-4xl font-semibold tabular-nums text-cyan",
					children: snap.score.toLocaleString("zh-CN")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-mist",
					children: [
						"到达第 ",
						snap.wave,
						" 波",
						snap.newBest ? " · 新纪录" : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-5 block text-sm text-mist",
					children: ["呼号", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						maxLength: 8,
						autoComplete: "off",
						spellCheck: false,
						onChange: (event) => {
							const value = event.target.value.slice(0, 8);
							setName(value);
							if (editTs != null) setRows(renameScore(editTs, value));
						},
						className: "mt-2 h-12 w-full rounded-xl border border-line bg-void px-3 text-base text-ink outline-none focus:border-cyan"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: primaryBtn,
						onClick: () => simRef.current?.start(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "再来一局"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: ghostBtn,
						onClick: () => simRef.current?.quitToMenu(),
						children: "返回标题"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
					rows,
					highlight: editTs
				})
			] }) : null
		]
	});
}
function Hud({ snap, onPause }) {
	const ratio = Math.max(0, Math.min(1, snap.hp / snap.maxHp));
	const low = snap.hp <= 30;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 safe-pad",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-mist",
							children: "生命"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-2 w-28 overflow-hidden rounded-full bg-line sm:w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `h-full origin-left ${low ? "bg-danger" : "bg-cyan"}`,
								style: { transform: `scaleX(${ratio})` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-1 text-sm tabular-nums ${low ? "text-danger" : "text-ink"}`,
							children: snap.hp
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-mist",
							children: "波次"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold tabular-nums",
							children: snap.wave
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-mist",
							children: ["剩余 ", snap.left]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-mist",
							children: "分数"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold tabular-nums text-cyan",
							children: snap.score.toLocaleString("zh-CN")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tabular-nums text-mist",
							children: ["最高 ", snap.best.toLocaleString("zh-CN")]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					label: "多重",
					detail: snap.spreadTier >= 2 ? "五向" : "三向",
					seconds: snap.spreadT,
					active: snap.spreadT > 0,
					tone: "cyan",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					label: "护盾",
					seconds: snap.shieldT,
					active: snap.shieldT > 0,
					tone: "cyan",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					label: "加速",
					seconds: snap.boostT,
					active: snap.boostT > 0,
					tone: "amber",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" })
				}),
				snap.combo >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-11 items-center gap-2 rounded-full border border-amber bg-panel/80 px-3 text-amber",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium",
						children: "连击"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs tabular-nums",
						children: [
							snap.combo,
							" ×",
							comboMultiplier(snap.combo)
						]
					})]
				}) : null,
				snap.phase === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pointer-events-auto ml-auto inline-flex size-12 items-center justify-center rounded-full border border-line bg-panel/85 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
					onClick: onPause,
					"aria-label": "暂停",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" })
				}) : null
			]
		})]
	});
}
function Chip({ label, detail, seconds, active, tone, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex min-h-11 items-center gap-2 rounded-full border bg-panel/80 px-3 ${active ? tone === "amber" ? "border-amber text-amber" : "border-cyan text-cyan" : "border-line text-mist opacity-60"}`,
		title: label,
		children: [
			icon,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tabular-nums",
				children: active ? `${detail ? `${detail} ` : ""}${seconds.toFixed(1)}s` : "—"
			})
		]
	});
}
function Menu({ rows, best, muted, onStart, onMute }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 flex safe-pad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "m-auto max-h-full w-full max-w-md overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-line bg-panel/90 p-5 backdrop-blur-md sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-widest text-cyan",
						children: "DV-07"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-4xl font-semibold tracking-tight sm:text-5xl",
						children: "深空猎手"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-mist",
						children: "俯视星域。守住船体，把一波波敌舰清干净。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							id: "start-btn",
							type: "button",
							className: primaryBtn,
							onClick: onStart,
							children: "开始出击"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: ghostBtn,
							onClick: onMute,
							children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }), muted ? "音效已关" : "音效开着"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-5 space-y-3 text-sm text-mist",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "mt-0.5 size-4 shrink-0 text-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WASD 或方向键八向移动，斜向不会更快。" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, { className: "mt-0.5 size-4 shrink-0 text-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "光标平滑引领飞船。触控时它会跟在手指上方。" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "mt-0.5 size-4 shrink-0 text-cyan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "自动锁定最近的敌人。空格或按住指针也能连射。" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-mist",
						children: [
							"击毁敌舰有机会掉落多重射击、护盾、加速和修复。每五波会有一座要塞压境，连续击毁会叠连击倍率。当前最高 ",
							best.toLocaleString("zh-CN"),
							"。"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, { rows })
				]
			})
		})
	});
}
function Overlay({ children, onBackdrop }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 flex bg-void/70 safe-pad",
		onClick: onBackdrop,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "m-auto max-h-full w-full max-w-md overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-2xl border border-line bg-panel p-5 sm:p-6",
				onClick: (event) => event.stopPropagation(),
				children
			})
		})
	});
}
function Board({ rows, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm font-medium text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-amber" }), "最高分榜"]
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-mist",
			children: "还没有战绩。打完一局会记在这台设备上。"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-2 divide-y divide-line",
			children: rows.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3 py-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `w-5 tabular-nums ${index === 0 ? "text-amber" : "text-mist"}`,
						children: index + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `min-w-0 flex-1 truncate ${row.ts === highlight ? "text-cyan" : "text-ink"}`,
						children: row.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-mist",
						children: [
							"第 ",
							row.wave,
							" 波"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 tabular-nums text-ink",
						children: row.score.toLocaleString("zh-CN")
					})
				]
			}, row.ts))
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpaceShooter, {});
}
//#endregion
export { Home as component };
