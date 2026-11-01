import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Crosshair,
  Keyboard,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { Sim, comboMultiplier, type Snap } from "@/game/sim";
import { loadName, loadScores, recordScore, renameScore, type ScoreRow } from "@/game/scores";

const INITIAL: Snap = {
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
  combo: 0,
};

const primaryBtn =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cyan px-6 text-base font-semibold text-void transition-colors duration-200 hover:bg-cyan/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";
const ghostBtn =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-void/70 px-5 text-base font-medium text-ink transition-colors duration-200 hover:border-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";

export function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  const savedRun = useRef(0);
  const [snap, setSnap] = useState<Snap>(INITIAL);
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [name, setName] = useState("ACE");
  const [editTs, setEditTs] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sim = new Sim(canvas, {
      onSnap: (next) => {
        setSnap(next);
        if (next.phase === "over" && savedRun.current !== next.runId) {
          savedRun.current = next.runId;
          const row: ScoreRow = {
            name: loadName(),
            score: next.score,
            wave: next.wave,
            ts: Date.now(),
          };
          setRows(recordScore(row));
          setEditTs(row.ts);
          setName(row.name);
        }
      },
    });
    simRef.current = sim;
    setRows(loadScores());
    const qa = import.meta.env.DEV || new URLSearchParams(window.location.search).has("qa");
    if (qa) {
      window.__controlsTest = {
        getYaw: () => sim.getMovementYaw(),
        getSpeed: () => sim.getSpeed(),
        setKeys: (codes) => sim.setKeys(codes),
        getX: () => sim.getX(),
        getY: () => sim.getY(),
      };
    }
    return () => {
      sim.destroy();
      simRef.current = null;
      delete window.__controlsTest;
    };
  }, []);

  const playing = snap.phase === "play" || snap.phase === "dying" || snap.phase === "pause";

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-void text-ink select-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label="深空猎手游戏画面"
      />
      {snap.phase !== "menu" ? <h1 className="sr-only">深空猎手</h1> : null}

      {playing ? (
        <Hud
          snap={snap}
          onPause={() => simRef.current?.togglePause()}
        />
      ) : null}

      {snap.banner && playing ? (
        <div className="pointer-events-none absolute inset-x-0 top-1/3 flex justify-center px-4">
          <p className="rise-in text-3xl font-semibold tracking-wide text-ink">{snap.banner}</p>
        </div>
      ) : null}

      {snap.phase === "menu" ? (
        <Menu
          rows={rows}
          best={Math.max(snap.best, rows[0]?.score ?? 0)}
          muted={snap.muted}
          onStart={() => simRef.current?.start()}
          onMute={() => simRef.current?.setMuted(!snap.muted)}
        />
      ) : null}

      {snap.phase === "pause" ? (
        <Overlay onBackdrop={() => simRef.current?.resume()}>
          <h2 className="text-2xl font-semibold">已暂停</h2>
          <p className="mt-1 text-sm text-mist">Esc 或 P 继续。返回标题不记分。</p>
          <div className="mt-5 flex flex-col gap-3">
            <button type="button" className={primaryBtn} onClick={() => simRef.current?.resume()}>
              <Play className="size-4" />
              继续
            </button>
            <button type="button" className={ghostBtn} onClick={() => simRef.current?.start()}>
              <RotateCcw className="size-4" />
              重新开始
            </button>
            <button type="button" className={ghostBtn} onClick={() => simRef.current?.quitToMenu()}>
              返回标题
            </button>
            <button type="button" className={ghostBtn} onClick={() => simRef.current?.setMuted(!snap.muted)}>
              {snap.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              {snap.muted ? "打开音效" : "关闭音效"}
            </button>
          </div>
        </Overlay>
      ) : null}

      {snap.phase === "over" ? (
        <Overlay>
          <p className="text-sm tracking-widest text-danger">船体解体</p>
          <h2 className="mt-1 text-4xl font-semibold tabular-nums text-cyan">{snap.score.toLocaleString("zh-CN")}</h2>
          <p className="mt-1 text-sm text-mist">
            到达第 {snap.wave} 波{snap.newBest ? " · 新纪录" : ""}
          </p>
          <label className="mt-5 block text-sm text-mist">
            呼号
            <input
              value={name}
              maxLength={8}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => {
                const value = event.target.value.slice(0, 8);
                setName(value);
                if (editTs != null) setRows(renameScore(editTs, value));
              }}
              className="mt-2 h-12 w-full rounded-xl border border-line bg-void px-3 text-base text-ink outline-none focus:border-cyan"
            />
          </label>
          <div className="mt-4 flex flex-col gap-3">
            <button type="button" className={primaryBtn} onClick={() => simRef.current?.start()}>
              <RotateCcw className="size-4" />
              再来一局
            </button>
            <button type="button" className={ghostBtn} onClick={() => simRef.current?.quitToMenu()}>
              返回标题
            </button>
          </div>
          <Board rows={rows} highlight={editTs} />
        </Overlay>
      ) : null}
    </main>
  );
}

function Hud({ snap, onPause }: { snap: Snap; onPause: () => void }) {
  const ratio = Math.max(0, Math.min(1, snap.hp / snap.maxHp));
  const low = snap.hp <= 30;
  return (
    <div className="pointer-events-none absolute inset-0 safe-pad">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-mist">生命</p>
          <div className="mt-1 h-2 w-28 overflow-hidden rounded-full bg-line sm:w-40">
            <div
              className={`h-full origin-left ${low ? "bg-danger" : "bg-cyan"}`}
              style={{ transform: `scaleX(${ratio})` }}
            />
          </div>
          <p className={`mt-1 text-sm tabular-nums ${low ? "text-danger" : "text-ink"}`}>
            {snap.hp}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-mist">波次</p>
          <p className="text-lg font-semibold tabular-nums">{snap.wave}</p>
          <p className="text-xs text-mist">剩余 {snap.left}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-mist">分数</p>
          <p className="text-lg font-semibold tabular-nums text-cyan">{snap.score.toLocaleString("zh-CN")}</p>
          <p className="text-xs tabular-nums text-mist">最高 {snap.best.toLocaleString("zh-CN")}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Chip label="多重" detail={snap.spreadTier >= 2 ? "五向" : "三向"} seconds={snap.spreadT} active={snap.spreadT > 0} tone="cyan" icon={<Crosshair className="size-4" />} />
        <Chip label="护盾" seconds={snap.shieldT} active={snap.shieldT > 0} tone="cyan" icon={<Shield className="size-4" />} />
        <Chip label="加速" seconds={snap.boostT} active={snap.boostT > 0} tone="amber" icon={<Zap className="size-4" />} />
        {snap.combo >= 2 ? (
          <div className="flex min-h-11 items-center gap-2 rounded-full border border-amber bg-panel/80 px-3 text-amber">
            <span className="text-xs font-medium">连击</span>
            <span className="text-xs tabular-nums">
              {snap.combo} ×{comboMultiplier(snap.combo)}
            </span>
          </div>
        ) : null}
        {snap.phase === "play" ? (
          <button
            type="button"
            className="pointer-events-auto ml-auto inline-flex size-12 items-center justify-center rounded-full border border-line bg-panel/85 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
            onClick={onPause}
            aria-label="暂停"
          >
            <Pause className="size-5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Chip({
  label,
  detail,
  seconds,
  active,
  tone,
  icon,
}: {
  label: string;
  detail?: string;
  seconds: number;
  active: boolean;
  tone: "cyan" | "amber";
  icon: ReactNode;
}) {
  const hot = active ? (tone === "amber" ? "border-amber text-amber" : "border-cyan text-cyan") : "border-line text-mist opacity-60";
  return (
    <div className={`flex min-h-11 items-center gap-2 rounded-full border bg-panel/80 px-3 ${hot}`} title={label}>
      {icon}
      <span className="text-xs font-medium">{label}</span>
      <span className="text-xs tabular-nums">
        {active ? `${detail ? `${detail} ` : ""}${seconds.toFixed(1)}s` : "—"}
      </span>
    </div>
  );
}

function Menu({
  rows,
  best,
  muted,
  onStart,
  onMute,
}: {
  rows: ScoreRow[];
  best: number;
  muted: boolean;
  onStart: () => void;
  onMute: () => void;
}) {
  return (
    <div className="absolute inset-0 flex safe-pad">
      <div className="m-auto max-h-full w-full max-w-md overflow-y-auto">
        <section className="rounded-2xl border border-line bg-panel/90 p-5 backdrop-blur-md sm:p-6">
          <p className="text-xs tracking-widest text-cyan">DV-07</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">深空猎手</h1>
          <p className="mt-2 text-sm text-mist">俯视星域。守住船体，把一波波敌舰清干净。</p>
          <div className="mt-5 flex flex-col gap-3">
            <button id="start-btn" type="button" className={primaryBtn} onClick={onStart}>
              开始出击
            </button>
            <button type="button" className={ghostBtn} onClick={onMute}>
              {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              {muted ? "音效已关" : "音效开着"}
            </button>
          </div>
          <ul className="mt-5 space-y-3 text-sm text-mist">
            <li className="flex items-start gap-3">
              <Keyboard className="mt-0.5 size-4 shrink-0 text-cyan" />
              <span>WASD 或方向键八向移动，斜向不会更快。</span>
            </li>
            <li className="flex items-start gap-3">
              <MousePointer2 className="mt-0.5 size-4 shrink-0 text-cyan" />
              <span>光标平滑引领飞船。触控时它会跟在手指上方。</span>
            </li>
            <li className="flex items-start gap-3">
              <Crosshair className="mt-0.5 size-4 shrink-0 text-cyan" />
              <span>自动锁定最近的敌人。空格或按住指针也能连射。</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-mist">
            击毁敌舰有机会掉落多重射击、护盾、加速和修复。每五波会有一座要塞压境，连续击毁会叠连击倍率。当前最高 {best.toLocaleString("zh-CN")}。
          </p>
          <Board rows={rows} />
        </section>
      </div>
    </div>
  );
}

function Overlay({ children, onBackdrop }: { children: ReactNode; onBackdrop?: () => void }) {
  return (
    <div className="absolute inset-0 flex bg-void/70 safe-pad" onClick={onBackdrop}>
      <div className="m-auto max-h-full w-full max-w-md overflow-y-auto">
        <section
          className="rounded-2xl border border-line bg-panel p-5 sm:p-6"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </section>
      </div>
    </div>
  );
}

function Board({ rows, highlight }: { rows: ScoreRow[]; highlight?: number | null }) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-sm font-medium text-ink">
        <Trophy className="size-4 text-amber" />
        最高分榜
      </div>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-mist">还没有战绩。打完一局会记在这台设备上。</p>
      ) : (
        <ol className="mt-2 divide-y divide-line">
          {rows.map((row, index) => (
            <li key={row.ts} className="flex items-center gap-3 py-2 text-sm">
              <span className={`w-5 tabular-nums ${index === 0 ? "text-amber" : "text-mist"}`}>{index + 1}</span>
              <span className={`min-w-0 flex-1 truncate ${row.ts === highlight ? "text-cyan" : "text-ink"}`}>
                {row.name}
              </span>
              <span className="text-mist">第 {row.wave} 波</span>
              <span className="shrink-0 tabular-nums text-ink">{row.score.toLocaleString("zh-CN")}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
