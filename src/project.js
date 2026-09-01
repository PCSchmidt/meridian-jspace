/**
 * Phase 1 mechanical J-space.
 * Maps an Evaluator reject payload onto verbalizable concept tokens.
 * Does not load Qwen, fit jacobian-lens, or write GitHub.
 */

import { CONCEPTS, FORBIDDEN, STUB, blobOf } from './concepts.js'

export const READOUT_SCHEMA = 'meridian-jspace.readout.v1'

export function refuseGitHubWrite(action = 'write') {
  const error = new Error(`GitHub ${action} refused: meridian-jspace Phase 1 is local interpretability only`)
  error.code = 'github_write_refused'
  throw error
}

export function refuseLiveModel(action = 'qwen') {
  const error = new Error(`Live ${action} refused: Phase 1 is mechanical-jspace. Jacobian-lens / Qwen is Phase 2.`)
  error.code = 'live_model_refused'
  throw error
}

function scoreConcept(concept, blob, reject) {
  const codes = (reject?.issues || []).map((row) => String(row.code || ''))
  const codeHit = concept.codes.some((code) => codes.includes(code))
  const tokenHit = concept.tokens.some((token) => blob.toLowerCase().includes(String(token).toLowerCase()))
  if (codeHit) return 1
  if (tokenHit) return 0.85
  return 0
}

export function projectReject(reject, opts = {}) {
  const blob = blobOf(reject)
  const concepts = CONCEPTS
    .map((concept) => ({
      id: concept.id,
      score: scoreConcept(concept, blob, reject),
      evidence: concept.codes.filter((code) => (reject?.issues || []).some((row) => row.code === code)),
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)

  const issueTokens = (reject?.issues || []).map((row) => ({
    token: row.code || 'unknown',
    score: 1,
  }))
  const conceptTokens = concepts.map((row) => ({ token: row.id, score: row.score }))

  return {
    schema: READOUT_SCHEMA,
    model: 'mechanical-jspace',
    backend: 'mechanical',
    observed_at: opts.now ?? new Date().toISOString(),
    reject: {
      verdict: reject?.verdict || null,
      issues: reject?.issues || [],
      notes: reject?.notes || '',
    },
    layers: [
      { layer: 0, position: 'issues', top_k: issueTokens.slice(0, 8) },
      { layer: 1, position: 'concepts', top_k: conceptTokens.slice(0, 8) },
      { layer: 2, position: 'verbalizable', top_k: conceptTokens.slice(0, 5) },
    ],
    concepts,
    live_model: false,
    github_write: false,
    webhook_posted: false,
  }
}

export function gateReadout(report) {
  const issues = []
  const blob = JSON.stringify(report || {})
  if (report?.schema !== READOUT_SCHEMA) {
    issues.push({ severity: 'high', code: 'bad_schema', message: 'Readout schema mismatch' })
  }
  if (report?.github_write || report?.comments_posted || report?.issues_opened) {
    issues.push({ severity: 'high', code: 'github_write', message: 'J-space must not write to GitHub' })
  }
  if (report?.webhook_posted) {
    issues.push({ severity: 'high', code: 'webhook_posted', message: 'J-space must not post webhooks' })
  }
  if (report?.live_model || report?.backend === 'qwen' || report?.backend === 'jacobian-lens') {
    issues.push({ severity: 'high', code: 'live_model', message: 'Phase 1 must not load Qwen or jacobian-lens' })
  }
  if (STUB.test(blob) && !(report?.concepts || []).some((row) => row.id === 'stub_as_done')) {
    issues.push({ severity: 'high', code: 'stub_as_done', message: 'Stub language in readout without concept' })
  }
  if (FORBIDDEN.test(blob) && !(report?.concepts || []).some((row) => row.id === 'extra_entity')) {
    issues.push({ severity: 'high', code: 'extra_entity', message: 'Program token in readout without extra_entity concept' })
  }
  if ((report?.reject?.verdict === 'fail' || report?.reject?.verdict === 'warn') && !(report?.concepts || []).length) {
    issues.push({ severity: 'high', code: 'empty_readout', message: 'Reject produced no verbalizable concepts' })
  }
  const highIssue = issues.some((row) => row.severity === 'high')
  return {
    ...report,
    issues,
    verdict: highIssue ? 'fail' : 'pass',
    act: false,
  }
}

export function readout(reject, opts = {}) {
  if (opts.post === true || opts.githubWrite === true || opts.comment === true || opts.issue === true) {
    refuseGitHubWrite('jspace')
  }
  if (opts.qwen === true || opts.liveModel === true || opts.download === true || opts.jacobian === true) {
    refuseLiveModel()
  }
  return gateReadout(projectReject(reject, opts))
}
