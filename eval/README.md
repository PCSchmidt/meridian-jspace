# eval/

Held-out gate table for mechanical J-space readouts (portfolio-kit D3).

```sh
npm test
npm run eval
```

- No network, no GitHub writes, no LLM, no Qwen download
- Cases: [cases.json](cases.json) (`MJS-001`–`MJS-012`)
- Known-bad readouts must not `act`
- Live-model / jacobian-lens flags fail closed until Phase 2
