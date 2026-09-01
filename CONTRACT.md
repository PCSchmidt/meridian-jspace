# CONTRACT.md

**Project:** meridian-jspace
**Owner:** Chris Schmidt
**Date:** 2026-09-01
**Reliability layer:** Meridian contracts via [portfolio-kit](https://github.com/PCSchmidt/portfolio-kit) 0.1.0

---

## Scope

Turn an **Evaluator reject payload** into a verbalizable J-space readout so a human can say *why* the gate fired. Phase 1 is a **mechanical** projector (issue codes → concept tokens). It does not download Qwen, fit Anthropic jacobian-lens, or post GitHub.

### In scope

- Readout schema `meridian-jspace.readout.v1`
- Concept catalog: extra_entity, stub_as_done, self_grade, missing_artifact, bad_schema
- Layer × position proxy: issues / concepts / verbalizable top-k
- Fail closed on GitHub writes, webhooks, and live-model flags
- Portfolio-kit D3 on known-bad readouts
- Public / unclassified fixtures only

### Out of scope

- JPO / F-35 / employer program data except as known-bad eval strings
- Replacing Claude Code / Cursor / Copilot
- Live `jacobian-lens` fit / apply on Qwen *(Phase 2)*
- Interactive HTML slice vis *(Phase 4)*
- Inject-bad-output faithfulness eval *(Phase 5)*
- redteam-blue-gate
- HardPowerIntelligence

---

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node 20+ stdlib |
| Reliability | Mechanical gate + portfolio-kit verdict shape |
| Models | None in Phase 1 (`mechanical-jspace`) |
| Deploy | Local `npm test` / `npm run eval` |

---

## Acceptance criteria

1. Happy path works against SPEC.md
2. `npm test` and `npm run eval` exit 0
3. Readouts never `act`
4. Eval table uses portfolio-kit D3
5. Data policy grep is clean
6. `--qwen` / `--download-model` / `--jacobian-lens` fail closed

---

## Known constraints

- Phase 1 does not require GPU, torch, or HuggingFace.
- Windows host via Git Bash.
