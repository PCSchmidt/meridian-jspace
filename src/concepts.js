/**
 * Verbalizable concept catalog for mechanical J-space.
 * Analogous to jacobian-lens unembedding: issue codes → concept tokens.
 */

export const FORBIDDEN = /\b(F-?35|JPO|ITAR|CUI|classified)\b|employer inventory/i
export const STUB = /\b(TODO|TBD|placeholder|coming soon)\b/i

export const CONCEPTS = Object.freeze([
  {
    id: 'extra_entity',
    tokens: ['F-35', 'JPO', 'ITAR', 'CUI', 'classified', 'extra_entity', 'employer inventory'],
    codes: ['extra_entity'],
  },
  {
    id: 'stub_as_done',
    tokens: ['TODO', 'TBD', 'placeholder', 'coming soon', 'stub_as_done'],
    codes: ['stub_as_done'],
  },
  {
    id: 'self_grade',
    tokens: ['generator_self_score', 'self_grade', 'self-score'],
    codes: ['self_grade', 'self_grade_contamination'],
  },
  {
    id: 'missing_artifact',
    tokens: ['missing_id', 'missing_rule', 'missing_citation', 'missing_artifact'],
    codes: ['missing_id', 'missing_rule', 'missing_citation', 'missing_artifact'],
  },
  {
    id: 'bad_schema',
    tokens: ['bad_schema', 'schema mismatch'],
    codes: ['bad_schema'],
  },
])

export function blobOf(reject) {
  const issues = (reject?.issues || []).map((row) => `${row.code || ''} ${row.message || ''}`).join(' ')
  return `${reject?.verdict || ''} ${reject?.notes || ''} ${issues} ${JSON.stringify(reject || {})}`
}
