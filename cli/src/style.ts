// 터미널 서식 — ANSI 직접 (의존성 0, CLI-001 §출력 서식)
export type Level = 0 | 1 | 3; // 0 평문 · 1 16색 · 3 트루컬러
export type Paint = Record<"brand" | "bad" | "warn" | "bold" | "dim", (s: string) => string>;
type Stream = { isTTY?: boolean; hasColors?: (n?: number) => boolean };

// 색 단계 판정 — TTY면 Node 판정(NO_COLOR·FORCE_COLOR·TERM 반영)
export function colorLevel(s: Stream, env: Record<string, string | undefined>): Level {
  if (!s.isTTY || !s.hasColors) return env.FORCE_COLOR && env.FORCE_COLOR !== "0" ? 1 : 0;
  return s.hasColors(2 ** 24) ? 3 : s.hasColors() ? 1 : 0;
}

const wrap = (on: string, off: string) => (s: string) => `\x1b[${on}m${s}\x1b[${off}m`;
const id = (s: string) => s;

// 단계별 서식 함수 — 0이면 원문 그대로
export function paint(level: Level): Paint {
  if (level === 0) return { brand: id, bad: id, warn: id, bold: id, dim: id };
  return {
    brand: wrap(level === 3 ? "38;2;42;144;75" : "32", "39"), // 웹 --primary 계열, L 0.58
    bad: wrap("31", "39"),
    warn: wrap("33", "39"),
    bold: wrap("1", "22"),
    dim: wrap("2", "22"),
  };
}

const FRAMES = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
const CLEAR = "\r\x1b[2K";

// 스피너 — 비TTY면 문구 1줄만. 반환값 = 정지(줄 지움)
// ponytail: 문구가 터미널 폭을 넘으면 잔상 — 현 문구 ≤60칸이라 수용
export function spinner(out: { isTTY?: boolean; write: (s: string) => unknown }, text: string, brand: (s: string) => string): () => void {
  if (!out.isTTY) { out.write(`${text}\n`); return () => {}; }
  let i = 0;
  const draw = () => out.write(`${CLEAR}${brand(FRAMES[i++ % FRAMES.length])} ${text}`);
  draw();
  const t = setInterval(draw, 80);
  return () => { clearInterval(t); out.write(CLEAR); };
}
