# AGENTS.md

## Read first

1. [README.md](README.md) and [STATUS.md](STATUS.md)
2. [CONTRACT.md](CONTRACT.md)
3. [portfolio-kit DATA_POLICY](https://github.com/PCSchmidt/portfolio-kit/blob/main/docs/DATA_POLICY.md)

## Do

- Keep readout JSON field names stable.
- Run `npm test` and `npm run eval` after concept or gate changes.
- Use public / synthetic Evaluator rejects only.

## Do not

- Start redteam-blue-gate.
- Download or run Qwen / jacobian-lens in Phase 1.
- Open GitHub issues or post webhooks.
- Put JPO / F-35 content in fixtures except as known-bad eval strings.
- Treat a generator self-score as a pass.
