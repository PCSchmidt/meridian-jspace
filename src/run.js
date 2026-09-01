#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { readout, refuseGitHubWrite, refuseLiveModel } from './project.js'

function parseArgs(argv) {
  const args = argv.slice(2)
  if (args.includes('--github-write') || args.includes('--comment') || args.includes('--issue')) {
    refuseGitHubWrite('cli')
  }
  if (args.includes('--qwen') || args.includes('--download-model') || args.includes('--jacobian-lens')) {
    refuseLiveModel('cli')
  }
  const rest = args.filter((arg) => !['--github-write', '--comment', '--issue', '--qwen', '--download-model', '--jacobian-lens'].includes(arg))
  return { path: rest[0] }
}

function main() {
  const { path } = parseArgs(process.argv)
  const reject = path
    ? JSON.parse(readFileSync(path, 'utf8'))
    : { verdict: 'fail', issues: [{ severity: 'high', code: 'stub_as_done', message: 'placeholder' }], notes: '' }
  process.stdout.write(`${JSON.stringify(readout(reject), null, 2)}\n`)
}

const invoked = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (invoked) main()
