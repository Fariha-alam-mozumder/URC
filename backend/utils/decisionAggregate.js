// backend/utils/decisionAggregate.js
const ORDER = ["ACCEPT", "MINOR_REVISIONS", "MAJOR_REVISIONS", "REJECT"]; // severity: REJECT > MAJOR > MINOR > ACCEPT

/**
 * Aggregate ReviewDecision[] into one final decision following your rules.
 * @param {Array<"ACCEPT"|"REJECT"|"MINOR_REVISIONS"|"MAJOR_REVISIONS">} decisions
 * @returns {ReviewDecision|null}
 */
export function aggregateDecision(decisions) {
  const counts = { ACCEPT: 0, REJECT: 0, MINOR_REVISIONS: 0, MAJOR_REVISIONS: 0 };
  for (const d of decisions) if (counts[d] !== undefined) counts[d]++;

  // If no decisions, return null (caller decides what to do)
  const total = Object.values(counts).reduce((a,b)=>a+b,0);
  if (!total) return null;

  // 1) If REJECT > all others → REJECT
  if (counts.REJECT > Math.max(counts.ACCEPT, counts.MINOR_REVISIONS, counts.MAJOR_REVISIONS)) {
    return "REJECT";
  }

  // 2) If ACCEPT strictly > (MINOR + MAJOR) → ACCEPT
  if (counts.ACCEPT > (counts.MINOR_REVISIONS + counts.MAJOR_REVISIONS)) {
    return "ACCEPT";
  }

  // 3) Else if (MINOR + MAJOR) ≥ majority:
  const minPlusMaj = counts.MINOR_REVISIONS + counts.MAJOR_REVISIONS;
  if (minPlusMaj >= Math.floor(total/2) + 1 || minPlusMaj >= Math.ceil(total/2)) {
    // If MAJOR ≥ MINOR → MAJOR; else MINOR
    return counts.MAJOR_REVISIONS >= counts.MINOR_REVISIONS ? "MAJOR_REVISIONS" : "MINOR_REVISIONS";
  }

  // 4) Ties → more conservative by severity: REJECT > MAJOR > MINOR > ACCEPT
  // Build a tie-aware pick: choose the harshest label among those tied at max count
  const maxCount = Math.max(counts.ACCEPT, counts.MINOR_REVISIONS, counts.MAJOR_REVISIONS, counts.REJECT);
  const tied = ORDER.filter(k => counts[k] === maxCount);
  // Pick the conservative (harshest) among the tied, i.e., by severity
  // severity order inverse of ORDER; harshest is REJECT, then MAJOR, MINOR, ACCEPT
  const severity = { ACCEPT: 0, MINOR_REVISIONS: 1, MAJOR_REVISIONS: 2, REJECT: 3 };
  return tied.sort((a,b)=>severity[b]-severity[a])[0];
}
