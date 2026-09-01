# Status

**Phase:** 1 — mechanical J-space readout
**Date:** 2026-09-01
**Family handoff:** [portfolio-kit docs/STATUS.md](https://github.com/PCSchmidt/portfolio-kit/blob/main/docs/STATUS.md)

## Done

- CONTRACT/SPEC + concept catalog
- Mechanical projector (`src/project.js`) — Evaluator reject → verbalizable tokens
- Fail closed on GitHub writes and live Qwen / jacobian-lens
- Eval `MJS-001`–`MJS-012`

## Last measured

2026-09-01: `npm test` 7/7; D3 catch 1.0 (n=7); agreement 1.0; known-bad never `act`. Live Qwen / jacobian-lens refused.

## Not done

- Live jacobian-lens fit / apply on a small Qwen checkpoint (Phase 2)
- Interactive slice visualization
- Faithfulness eval against injected bad outputs

**Next:** Phase 2 instrument Evaluator reject path (optional tiny open-weight / jacobian-lens). Do not start red/blue.
