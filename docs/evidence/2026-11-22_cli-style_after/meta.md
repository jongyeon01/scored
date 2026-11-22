# CLI 출력 — 변경 후 (after)

| 항목 | 내용 |
|---|---|
| 대상 | `npx @jong-yeon/scored` 터미널 출력 (CLI-001 v1.3.0 §출력 서식) |
| 확인한 값 | ① 파이프: ESC 0개, `✔` 결과 줄 2개, 빈 줄 3개로 4구간 (`raw-pipe.txt`) ② TTY + `COLORTERM=truecolor`: 브랜드 색 `38;2;42;144;75` 20회, 줄 지우기 `[2K` 20회(스피너), 굵게 `[1m`·흐리게 `[2m` 출력 (`raw-tty.txt`) ③ TTY + `NO_COLOR=1`: 색 코드 0개, 스피너 줄 지우기 20회 (`raw-tty-no-color.txt`) ④ Node v18.20.8 TTY: exit 0, 트루컬러 21회 (`raw-tty-node18.txt`) ⑤ `--version`(TTY): `0.1.1` 평문 |
| 확인 방법 | 브랜치 `feat/cli-style`에서 `npm run build` 후 `node dist/index.js`. TTY는 macOS `script`로 생성, `cat -v`로 제어 문자를 보이게 변환. Node 18은 `npx -y node@18 dist/index.js` |
| 확인 일시 | 2026-11-22 20:5x KST |
| 환경 | macOS, Node v26.7.0 / v18.20.8, `TERM=xterm-256color`. 브라우저 오픈은 빈 `open` 스텁, HOME은 임시 디렉터리(`.claude/projects`만 실제 경로 심볼릭 링크). 기준 커밋 `b4bee36` + 작업 트리(미커밋) |
| 반영 산출물 | `docs/prd/CLI-001_분석기.md` §출력 서식·TC-CLI-001-18~21, `docs/prd/11_UX카피사전.md` CPY-CLI-006, `docs/history.md` 2026-11-22 항목 |
| 계산 근거 | 횟수는 각 raw 파일에 `grep -o <패턴> \| wc -l`. 프레임 수는 분석 소요 시간에 따라 실행마다 달라진다 (80ms 간격) |
| 브랜드 색 대비 | rgb(42,144,75) — #1e1e1e 대비 4.12:1, #ffffff 대비 4.05:1. oklch(0.58 0.14 150)→sRGB 변환 후 WCAG 상대 휘도식으로 계산 (`raw-contrast.tsv` — L 후보 5개 비교, 양쪽 4.5:1 동시 충족 값 없음) |
| 보안 | URL 해시 페이로드는 `#<payload 제거>`로 치환 — 전 파일 페이로드 패턴 잔존 0건 확인 |
| 미보관 | `capture.png` — 실제 터미널 화면 캡처 없음 (사용자 캡처 대기) |
