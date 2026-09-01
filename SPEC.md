# SPEC.md

Features as `##` headings, in priority order.

## Feature: Mechanical J-space readout

**Gate:** evaluated
**Acceptance:**

- [x] `readout` emits `meridian-jspace.readout.v1`
- [x] Evaluator fail/warn with issue codes maps onto concept tokens
- [x] Three proxy layers: issues, concepts, verbalizable
- [x] `act` is always false
- [x] `--github-write` / `--comment` / `--issue` fail closed
- [x] `--qwen` / `--download-model` / `--jacobian-lens` fail closed
- [x] Eval cases `MJS-001`–`MJS-012` cover good readouts and known-bad reports

**Out of scope for this feature:** live Qwen, jacobian-lens fit, HTML vis.
