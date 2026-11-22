# CLI 출력 — 변경 전 (before)

| 항목 | 내용 |
|---|---|
| 대상 | `npx @jong-yeon/scored` 터미널 출력 (CLI-001 v1.2.0) |
| 확인한 값 | 평문 6줄, 색·기호·빈 줄·스피너 없음. TTY에서도 ESC 시퀀스 0개 |
| 확인 방법 | `main`(`b4bee36`)의 `cli/`를 `git archive`로 꺼내 `node cli/src/index.ts` 실행. 파이프(`raw-pipe.txt`)와 `script`로 만든 가짜 TTY(`raw-tty.txt`, `cat -v` 변환) 두 경로 |
| 확인 일시 | 2026-11-22 20:5x KST |
| 환경 | macOS, Node v26.7.0, `TERM=xterm-256color`, `COLORTERM=truecolor`. 브라우저 오픈은 빈 `open` 스텁으로 대체, HOME은 임시 디렉터리(`.claude/projects`만 실제 경로 심볼릭 링크) |
| 반영 산출물 | `docs/prd/CLI-001_분석기.md` §출력 서식, `docs/history.md` 2026-11-22 항목 |
| 보안 | URL 해시 페이로드(활동 집계·하이라이트 포함 가능)는 `#<payload 제거>`로 치환 |
| 미보관 | `capture.png` — 실제 터미널 화면 캡처 없음 (사용자 캡처 대기) |
