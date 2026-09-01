import assert from 'node:assert/strict'
import { test } from 'node:test'
import { gateReadout, readout, refuseGitHubWrite, refuseLiveModel } from '../src/project.js'

const stubReject = {
  verdict: 'fail',
  issues: [{ severity: 'high', code: 'stub_as_done', message: 'placeholder in artifact' }],
  notes: 'mechanical judge',
}

test('reject projects onto stub_as_done concept', () => {
  const report = readout(stubReject, { now: '2026-09-01T12:00:00.000Z' })
  assert.equal(report.schema, 'meridian-jspace.readout.v1')
  assert.equal(report.backend, 'mechanical')
  assert.equal(report.verdict, 'pass')
  assert.equal(report.act, false)
  assert.equal(report.live_model, false)
  assert.equal(report.github_write, false)
  assert.ok(report.concepts.some((row) => row.id === 'stub_as_done' && row.score === 1))
  assert.equal(report.layers.length, 3)
})

test('F-35 reject maps extra_entity and still does not act', () => {
  const report = readout({
    verdict: 'fail',
    issues: [{ severity: 'high', code: 'extra_entity', message: 'F-35 overlay' }],
  })
  assert.equal(report.verdict, 'pass')
  assert.equal(report.act, false)
  assert.ok(report.concepts.some((row) => row.id === 'extra_entity'))
})

test('GitHub writes and live Qwen fail closed', () => {
  assert.throws(() => readout(stubReject, { githubWrite: true }), /local interpretability only/)
  assert.throws(() => readout(stubReject, { qwen: true }), /Phase 2/)
  assert.throws(() => refuseGitHubWrite('jspace'), /local interpretability only/)
  assert.throws(() => refuseLiveModel(), /Phase 2/)

  const gh = gateReadout({
    schema: 'meridian-jspace.readout.v1',
    backend: 'mechanical',
    reject: { verdict: 'fail', issues: [] },
    concepts: [{ id: 'stub_as_done', score: 1 }],
    github_write: true,
    live_model: false,
  })
  assert.equal(gh.verdict, 'fail')
  assert.equal(gh.act, false)

  const live = gateReadout({
    schema: 'meridian-jspace.readout.v1',
    backend: 'qwen',
    live_model: true,
    reject: { verdict: 'fail', issues: [] },
    concepts: [{ id: 'stub_as_done', score: 1 }],
    github_write: false,
  })
  assert.equal(live.verdict, 'fail')
})

test('empty reject readout fails closed', () => {
  const report = readout({ verdict: 'fail', issues: [], notes: 'no codes' })
  assert.equal(report.verdict, 'fail')
  assert.ok(report.issues.some((row) => row.code === 'empty_readout'))
  assert.equal(report.act, false)
})
