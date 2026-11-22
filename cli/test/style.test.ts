// 출력 서식 — CLI-001 §출력 서식 TC-CLI-001-18~20
import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { colorLevel, paint, spinner } from "../src/style.ts";

const tty = (c16: boolean, c24: boolean) => ({ isTTY: true, hasColors: (n = 16) => (n > 256 ? c24 : c16) });

test("TC-CLI-001-18 비TTY·FORCE_COLOR 없음 → 단계 0, 서식 함수는 원문 그대로", () => {
  assert.equal(colorLevel({ isTTY: false }, {}), 0);
  assert.equal(colorLevel({}, { FORCE_COLOR: "0" }), 0);
  assert.equal(colorLevel({}, { FORCE_COLOR: "1" }), 1); // CI 강제 착색
  const p = paint(0);
  for (const f of [p.brand, p.bad, p.warn, p.bold, p.dim]) assert.equal(f("x"), "x");
});

test("TC-CLI-001-19 TTY 색 단계 — 트루컬러 / 16색 / 없음", () => {
  assert.equal(colorLevel(tty(true, true), {}), 3);
  assert.equal(colorLevel(tty(true, false), {}), 1);
  assert.equal(colorLevel(tty(false, false), {}), 0);
  assert.equal(paint(3).brand("✔"), "\x1b[38;2;42;144;75m✔\x1b[39m");
  assert.equal(paint(1).brand("✔"), "\x1b[32m✔\x1b[39m");
  assert.equal(paint(1).bad("✖"), "\x1b[31m✖\x1b[39m");
  assert.equal(paint(1).warn("⚠"), "\x1b[33m⚠\x1b[39m");
  assert.equal(paint(1).bold("3"), "\x1b[1m3\x1b[22m");
  assert.equal(paint(1).dim("안내"), "\x1b[2m안내\x1b[22m");
});

test("TC-CLI-001-18 비TTY 스피너 → 문구 1줄, 제어 문자 0", () => {
  const w: string[] = [];
  const stop = spinner({ isTTY: false, write: (s: string) => w.push(s) }, "찾는 중…", (s) => s);
  stop();
  assert.deepEqual(w, ["찾는 중…\n"]);
});

test("TC-CLI-001-20 TTY 스피너 — 프레임 갱신 후 정지하면 줄을 지우고 더 쓰지 않는다", () => {
  mock.timers.enable({ apis: ["setInterval"] });
  try {
    const w: string[] = [];
    const stop = spinner({ isTTY: true, write: (s: string) => w.push(s) }, "찾는 중…", (s) => s);
    mock.timers.tick(160);
    assert.equal(w.length, 3); // 즉시 1 + 80ms×2
    assert.ok(w[0].startsWith("\r\x1b[2K⠋ 찾는 중…") && w[1].includes("⠙"));
    stop();
    assert.equal(w.at(-1), "\r\x1b[2K");
    const n = w.length;
    mock.timers.tick(400);
    assert.equal(w.length, n);
  } finally {
    mock.timers.reset();
  }
});
