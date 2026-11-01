export type ScoreRow = {
  name: string;
  score: number;
  wave: number;
  ts: number;
};

const KEY = "deep-void-hunter-v1";
const NAME_KEY = "deep-void-hunter-name";
const MUTE_KEY = "deep-void-hunter-mute";

type SaveFile = { version: 1; rows: ScoreRow[] };

function read(): ScoreRow[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as SaveFile;
    if (data.version !== 1 || !Array.isArray(data.rows)) return [];
    return data.rows
      .filter((row) => row && typeof row.score === "number" && typeof row.ts === "number")
      .slice(0, 8);
  } catch {
    return [];
  }
}

function write(rows: ScoreRow[]) {
  const file: SaveFile = { version: 1, rows: rows.slice(0, 8) };
  localStorage.setItem(KEY, JSON.stringify(file));
}

export function cleanName(name: string) {
  const trimmed = name.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 8);
  return trimmed || "ACE";
}

export function loadScores() {
  return read().sort((a, b) => b.score - a.score || a.ts - b.ts);
}

export function loadBest() {
  return loadScores()[0]?.score ?? 0;
}

export function loadName() {
  try {
    return cleanName(localStorage.getItem(NAME_KEY) || "ACE");
  } catch {
    return "ACE";
  }
}

export function loadMute() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveMute(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* ignore quota */
  }
}

export function recordScore(row: ScoreRow) {
  const rows = loadScores();
  rows.push(row);
  rows.sort((a, b) => b.score - a.score || a.ts - b.ts);
  const top = rows.slice(0, 8);
  try {
    write(top);
    localStorage.setItem(NAME_KEY, cleanName(row.name));
  } catch {
    /* ignore quota */
  }
  return top;
}

export function renameScore(ts: number, name: string) {
  const next = cleanName(name);
  const rows = loadScores();
  const row = rows.find((item) => item.ts === ts);
  if (row) row.name = next;
  try {
    write(rows);
    localStorage.setItem(NAME_KEY, next);
  } catch {
    /* ignore quota */
  }
  return rows;
}
