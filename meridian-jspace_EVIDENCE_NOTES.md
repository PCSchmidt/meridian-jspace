# meridian-jspace: Evidence Notes

Companion to meridian-jspace.md. Labels: Confirmed, Ran it, Per the docs, My reading, Ask the author. Depth: LITE (4 commits). Repo state: main at 374e90f (2026-09-28). Read-only clone; no file in the clone was written, `git status` clean before and after all runs.

## E1 Fact sheet

- Name: meridian-jspace; public GitHub repo PCSchmidt/meridian-jspace; MIT (Confirmed: LICENSE, GitHub metadata). 0 stars, 0 forks (gh repo view).
- Kind: Node.js command-line library plus saved eval cases. Status per README/STATUS: "Phase 1, mechanical J-space readout".
- Size: src 179 lines (concepts.js 40, project.js 112, run.js 27); tests 95 lines (two files); eval/run.js 91; eval/cases.json 172 lines. No dependencies (package.json has none; no node_modules). Confirmed (wc -l).
- Tests: 7 pass, 0 fail, 0 skipped (Ran it: `npm test`, Node v24.19.0). Eval: ok true, 12 cases (5 good, 7 bad), D3 catch 1.0 (n=7), agreement 1.0, known_bad_no_act 1.0 (Ran it: `node eval/run.js`). Matches STATUS.md ("npm test 7/7; D3 catch 1.0 (n=7); agreement 1.0").
- Commits: 4, 2026-08-19 to 2026-09-28 (4d4f052, d792ef4, c56f6d1, 374e90f). Only 374e90f carries a Co-Authored-By trailer (an AI coding agent). First commit's author line has a placeholder email (your-github-email@example.com). No agent settings folders; AGENTS.md is present.
- Runs from a clean copy: yes, Node 20+ required (CI uses 20; local run used 24.19.0).
- Needs: nothing paid, no GPU, no network, no downloads.
- Deployed: no. Users: none known (Ask the author).
- Related: Meridian, portfolio-kit (contracts), other family repos (Per the docs).

## E2 Reading and running log

Read in full: README, STATUS, AGENTS, CONTRACT, SPEC, CONTRIBUTING, gates.yaml, package.json, test.yml, all of src, tests and eval/run.js, eval/README, fixtures, cases.json. Also read from the sibling clone of portfolio-kit (c39cbea, 2026-09-04, read-only): schemas/evaluator-verdict.schema.json and schemas/examples/evaluator-verdict.json, docs/EVAL_RUBRIC_TEMPLATE.md (D3 row).

Commands run (all in the clone, none writing to it): `node --version`; `npm test`; `node eval/run.js` (output to the scratchpad); `npm run project -- fixtures/reject-stub.json`; `node src/run.js --qwen` (refused, exit 1, stack trace); `node src/run.js --comment` and `--issue` (both refused, exit 1); three probe scripts in the scratchpad importing src/project.js; `git log`, `git show`, `git grep` for secret words (no hits); `gh run list`; `gh repo view`. Network: gh queries only. Not run: `gates.yaml` hooks (nothing in this repo executes them), the Meridian gate engine. Final `git status` in the clone: clean.

## E3 Claims check

Levels: L1 doc matches saved result; L2 reproduced by re-running; L3 independently recomputed.

- CL-01 STATUS "npm test 7/7": Ran it, L2. Supported.
- CL-02 STATUS "D3 catch 1.0 (n=7); agreement 1.0; known-bad never act": Ran it, L2; counts recomputed from cases.json (5 good: 001-004, 011; 7 bad: 005-010, 012), L3. Supported, with the caveats in E12.
- CL-03 README "Requires Node.js 20+. No dependencies, no network, no GPU": Confirmed (package.json engines; imports are node: only).
- CL-04 README "`--qwen`, `--download-model`, `--jacobian-lens`, `--github-write`, `--comment`, and `--issue` are refused": Ran it for `--qwen`, `--comment` and `--issue` from the CLI (exit 1 each); code paths for all six confirmed by reading run.js; options-object refusals (post, githubWrite, comment, issue, qwen, liveModel, download, jacobian) probed for post and jacobian: threw. Supported, L2 for two, L1 for rest.
- CL-05 README "does not download Qwen or fit jacobian-lens": Confirmed; no such code exists.
- CL-06 README architecture diagram (Mem -> Cap -> JL -> UI) and "Meridian already stores semantic / episodic / corrections memory": the program reads no Meridian memory and no stored verdict; the diagram is the plan, with the README noting Phase 1 uses a "mechanical proxy for Cap/JL". Supported as described; reading, not memory, is what is missing.
- CL-07 SPEC "`act` is always false": Confirmed, but by construction (`act: false` literal in gateReadout). My reading: tests and the no-act metric check a constant.
- CL-08 eval/README "Held-out gate table": partly. cases.json was added in the same commit as the checker (c56f6d1); `split: "held-out-fixtures"` is a label. No evidence the cases were hidden from the author of the checker (My reading).
- CL-09 CONTRACT acceptance 5 "Data policy grep is clean": no automated check in the repo; a manual `git grep` for secret-like words found nothing (Ran it, scope limited). Per the docs.
- CL-10 README "Three proxy layers" (SPEC): Confirmed; layers 1 and 2 are always identical because there are at most five concepts (slice 8 vs slice 5). Confirmed by reading and by the sample output.
- CL-11 CI "npm test; npm run eval on Node 20, push to main and pull requests": Confirmed (test.yml); 2 runs, both success (see E7).

Count: 11 claims checked; 0 contradicted; 2 partly (CL-06 reading gap, CL-08 label).

## E4 Rule attacks

Probes ran through `readout(reject, {now:'x'})` unless noted. Scripts in the scratchpad, not in the repo.

| Input | Result |
| --- | --- |
| code "weird_code", message "bad thing" | verdict fail, issue empty_readout, no concepts |
| verdict "pass", no issues | pass, no concepts |
| null / undefined reject | pass, no concepts |
| verdict fail, empty issues, notes "contains TODO" | pass, stub_as_done 0.85 |
| verdict fail, code "weird", message "F-35 mention" | pass, extra_entity 0.85 |
| verdict warn, unknown code | fail (empty_readout) |
| verdict fail, message "military style report" | pass, extra_entity 0.85 (substring "itar") |
| verdict fail, code missing_id, message "data is unclassified" | pass, missing_artifact 1, extra_entity 0.85 (substring "classified") |
| problem with no code field | fail (empty_readout) |
| `issues` is a string | THROWS TypeError (.map is not a function) |
| options post:true / jacobian:true | throw refusal (github_write_refused / live_model_refused) |
| option qwen:false with bad_schema code | not refused, pass |
| CLI `--qwen` | refused, exit 1 with stack trace |
| portfolio-kit-shaped verdict, description "Tests were not run before the feature was marked complete" (fields artifact, severity, description) | fail (empty_readout); layer 0 token "unknown" |
| same shape, description "Function bodies contain TODO placeholders" | pass, stub_as_done 0.85 by word match; layer 0 token "unknown" |

Rules not attacked: "act" can only be false; gateReadout's github_write, comments_posted and issues_opened keys were exercised only for github_write.

## E5 Code map

src/concepts.js: FORBIDDEN and STUB regexes, the five-concept CONCEPTS list, blobOf (verdict + notes + each `code message` + full JSON of the reject). src/project.js: refuseGitHubWrite, refuseLiveModel, scoreConcept (code hit 1; case-insensitive substring token hit 0.85), projectReject, gateReadout (7 rules, `act:false`), readout. src/run.js: CLI flag refusal, reads one JSON path or a built-in stub reject. eval/run.js: loadCatalog, runEval (D3 score 10 for a caught bad case; ok needs catch >= 0.85, agreement == 1, no-act == 1, n >= 12). tests: project.test.js (4 tests), eval.test.js (3). gates.yaml: three gates (confirmed, tests_passing, evaluated) in the family contract format; nothing in this repo runs it.

## E6 Model call sites

None. `model: 'mechanical-jspace'` is a label in the output. Qwen and jacobian-lens are named in README, CONTRACT, SPEC and error messages only.

## E7 Tests and CI

- Counts: 7 tests (project.test.js: stub projection, F-35 projection, refusals plus two bad readouts, empty reject; eval.test.js: catalog size/kinds, eval meets targets, F-35 never acts). 0 skipped. No coverage tool.
- Spot checks: (1) "GitHub writes and live Qwen fail closed" asserts the thrown messages and that two bad readouts give verdict fail: meaningful. (2) "F-35 reject never acts" asserts `act === false`, a literal in the code: weak. (3) "held-out eval meets gate-catch and agreement" re-runs runEval over cases written beside the checker: tests agreement with the author's own expectations.
- CI (`gh run list`): 2 runs on main, both success: 36466800336 (docs commit, 2026-09-28, 15 s) and 33510924116 (Phase 1 commit, 2026-09-01, 11 s). No runs for the two Phase 0 commits (workflow arrived in c56f6d1). CI runs `npm test` and `npm run eval`; no formatter, linter or coverage.

## E8 Plan versus results, history

Plan (Phase 0 README) 2026-08-19; implementation, cases and results arrive together in one commit (c56f6d1, 2026-09-01, 20 files, 819 insertions). An outsider cannot verify that expectations were written before the checker (Confirmed from the history). Commit credits: 1 of 4 carries an AI co-author trailer; the Phase 1 code commit carries none. 374e90f rewrote the README opening from "Instruments Meridian's three-tier memory and Evaluator reject path with a Jacobian-lens / J-space readout" to the narrower Phase 1 wording (Confirmed by diff). d792ef4 message: "Note family pause; stay on Phase 0."

## E9 Gates and approvals

gates.yaml defines three gates; SPEC names "Gate: evaluated". No gate state files, approvals or evaluator verdicts for this repo are committed. Whether the gates were ever run is Ask the author.

## E10 Environment

No lockfile needed (no dependencies). Results record no versions; the eval output has `seed: null`, `generated_at` from the clock (fixed `now` only in the tests). Results do not depend on package versions.

## E11 Security and privacy scan

`git grep` for secret, api_key and token= outside cases.json: no hits; no .env present; .gitignore excludes .env and model weight files. Outside services: none. The word list contains defense program terms as detector strings; no program data found (Confirmed by reading cases.json and fixtures). GitHub security settings not queried. No claim is made about any live deployment (there is none).

## E12 Shortcomings register

| ID | Shortcoming | Evidence | Severity | Disclosed? |
| --- | --- | --- | --- | --- |
| S1 | Reads `code` and `message`; the shared verdict schema defines issues as `artifact`, `severity`, `description` with no extra fields. On real-shaped verdicts the code tier never fires | project.js scoreConcept/blobOf vs portfolio-kit schemas/evaluator-verdict.schema.json; probes in E4 | High | No |
| S2 | Substring matching: "military" and "unclassified" trigger extra_entity | E4 | Medium | No |
| S3 | Eval cases written with the checker; six of seven bad cases are hand-written readouts; n=7; "held-out" label | E8, cases.json | Medium | Partly (README says "Held-out gate table"; STATUS gives n=7) |
| S4 | `act` is a constant, so no-act metric and test are vacuous | project.js | Low | No |
| S5 | Layers are a cosmetic proxy; layer 2 equals layer 1 | E3 CL-10 | Low | Partly (README says "proxy") |
| S6 | Non-array `issues` throws; null/empty reject passes | E4 | Low | No |
| S7 | No test uses a real Evaluator verdict or the portfolio-kit example file | tests, eval | High (same root as S1) | No |
| S8 | Data-policy check not automated though contract lists it | CONTRACT item 5 | Low | Partly |
| S9 | README tree lists fewer files than the repo has (AGENTS, CONTRIBUTING, gates.yaml, STATUS, eval/README, tests detail) | README "Current tree" | Low | No |

Options for S1 (re-run evidence: probe3.mjs): A, read `description` and `artifact` as well (small effort; keeps the contract; code tier still unused). B, add `code` to the shared schema (larger, changes a contract other repos copy; reversible only with a version bump). C, leave it and document that only word matching applies. Recommendation: A plus a test reading portfolio-kit's example verdict. Verify by a test that a kit-shaped fail yields at least one concept. S2: use word-boundary matching (small). S3: add real or hand-labelled rejections scored by a person, written before running.

## E13 Method detail

Scoring: score = 1 if any issue code is in the concept's code list; else 0.85 if any concept token occurs (case-insensitive substring) anywhere in blobOf; else 0 and dropped; results sorted by score. No formula beyond that. Catch-rate bound: 7/7 with a one-sided 95% limit 0.05^(1/7) = 0.652 (my arithmetic). Baselines recomputed: always-fail gate: catch 7/7, agreement 7/12 = 0.583; always-pass: catch 0/7, agreement 5/12.

## E14 Discrepancies

README says "Meridian already stores semantic / episodic / corrections memory ... Prefer extending those contracts"; code reads none of it. README "held-out" vs same-commit authoring. README file tree incomplete. STATUS date 2026-09-01 predates the 09-28 README edit (still accurate). First commit's author email is a placeholder.

## E15 Production readiness

Clean-start run: Yes (Node 20+, three commands). Automatic checks block bad change: Partly (tests and eval in CI; both mostly author-written). Quality measured against goal and baseline: No (agreement with own cases only). Safe when things go wrong: Partly (refusals; one crash path). Human review of AI steps: Not applicable in this repo (readout is advisory output). Versioned prompts/models: Not applicable (no model); schema string `meridian-jspace.readout.v1` is versioned. Logs and monitoring: No. Data and secrets: Yes for what exists (no secrets, synthetic data). Placement: between Experiment and Works locally.

## E16 Review dispositions

Second review done 2026-10-28; see meridian-jspace.review.md. Writer self-corrections: the checker-rule count (code has seven) fixed in the guide before saving.

## E17 Completeness register

| Promised | Status |
| --- | --- |
| Phase 1 mechanical readout, schema v1, five concepts, three layers | done; tested on author-made cases |
| Fail closed on GitHub writes and live model | done and tested |
| Eval MJS-001 to MJS-012 | done |
| Phase 2 instrument Evaluator reject path, optional Qwen and jacobian-lens | planned only |
| Phase 3 map reasons into fitted concepts | planned only |
| Phase 4 visualization | planned only |
| Phase 5 inject-bad-output faithfulness eval | planned only |
| Phase 6 technical note | planned only |

Backlog: Fix S1 and S2 (small, high payoff); Finish by running on real rejections from Meridian (medium); Improve eval with person-scored cases and intervals (medium); Add Phase 2 (large, depends on the above). Next milestone: a kit-shaped verdict file yields correct concepts in a test.

## Image data

Images in images/meridian-jspace-*.png, regenerated after the reader check (matplotlib, scratchpad venv): parts (now shows the Evaluator as source, Qwen replacing the mapper, jacobian-lens filling the readout, a visual page as Phase 4), journey (four steps matching the text; checker as its own box; Row 0 shown without a score because projectReject gives every issue token a constant score of 1, which the guide now states as meaningless), eval-cases (replaced the 12-bar chart with a 5 good / 7 bad summary; counts from cases.json: good MJS-001-004 and 011, bad 005-010 and 012; 6 of 7 bad cases carry a hand-written readout, MJS-008 is a reject).

Reader-check revision: guide trimmed to about 3,600 words; caveats (no real verdict, AI wrote code, layers are decoration) stated once in full; file line counts removed from the guide (E1 retains them); 65% bound restated (second review) as about 0.65, one-sided; two-sided Clopper-Pearson lower bound is about 0.59; terms defined at first use. No factual claims changed.
