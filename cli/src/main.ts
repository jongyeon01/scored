// CLI 본체 — 입출력·브라우저 오픈은 주입받아 테스트 가능 (종료 코드를 반환, process.exit 없음)
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { analyze } from "./analyze.ts";
import { listJsonl, readLines } from "./files.ts";
import { buildUrl } from "./encode.ts";
import { collectSessions, renderReport, writeReport, pruneOld } from "./report.ts";
import { CPY } from "./copy.ts";
import { paint, type Paint } from "./style.ts";

export type Deps = {
  home: string;
  now: Date;
  tz: string;
  open: (url: string) => Promise<void>;
  out: (line: string) => void;
  err: (line: string) => void;
  version: string;
  paint?: Paint; // stdout 서식 — 미지정이면 평문
  paintErr?: Paint; // stderr 서식 (따로 판정)
  spin?: (text: string) => () => void; // 미지정이면 문구 1줄
};

const HELP = `사용법: npx @jong-yeon/scored

~/.claude/projects 세션 기록을 이 컴퓨터에서만 분석해 오늘의 성적표를 브라우저로 엽니다.
네트워크 전송 없음 · 옵션 없음 (--help, --version만)`;

export async function main(argv: string[], d: Deps): Promise<number> {
  if (argv.includes("--help") || argv.includes("-h")) { d.out(HELP); return 0; }
  if (argv.includes("--version") || argv.includes("-v")) { d.out(d.version); return 0; }

  const p = d.paint ?? paint(0), e = d.paintErr ?? paint(0);
  const spin = d.spin ?? ((t: string) => (d.out(t), () => {}));
  const fatal = (msg: string) => d.err(`${e.bad("✖")} ${msg}`);
  const warn = (msg: string) => d.err(`${e.warn("⚠")} ${msg}`);
  const ok = (msg: string) => d.out(`${p.brand("✔")} ${msg}`);

  let stop = spin(CPY["CLI-001"]);
  let files: string[];
  try {
    files = await listJsonl(join(d.home, ".claude", "projects"));
  } catch {
    stop();
    fatal(CPY["ERR-006"]); // ERR-CLI-001
    return 1;
  }
  const payload = await analyze(readLines(files), { now: d.now, tz: d.tz });
  stop();
  if (!payload) { fatal(CPY["ERR-007"]); return 1; } // ERR-CLI-002

  const { sessions: n, prompts } = payload.stats;
  ok(CPY["CLI-002"](p.bold(payload.day), p.bold(String(n)), p.bold(String(prompts))));
  d.out("");
  const url = buildUrl(payload);
  d.out(url); // 항상 전체 URL, 서식 없음 (SSH·컨테이너 복사용)
  d.out(p.dim(CPY["CLI-003"]));
  try {
    await d.open(url);
  } catch {
    warn(CPY["ERR-008"]); // ERR-CLI-003 — 실패로 취급하지 않음
  }
  d.out("");
  // REQ-CLI-003 로컬 대화 리포트 — 실패해도 성적표는 유효 (ERR-CLI-004, exit 0)
  stop = spin(CPY["CLI-006"]);
  try {
    const dir = join(d.home, ".scored");
    const sessions = await collectSessions(readLines(files), payload.day, d.tz);
    const path = await writeReport(dir, payload.day, renderReport(sessions, payload.day, d.tz));
    await pruneOld(dir, payload.day); // 최근 7일 롤링
    stop();
    ok(CPY["CLI-004"](payload.day));
    await d.open(pathToFileURL(path).href); // 두 번째 탭
  } catch {
    stop();
    warn(CPY["ERR-010"]); // ERR-CLI-004
  }
  d.out("");
  d.out(p.dim(CPY["CLI-005"]));
  return 0;
}
