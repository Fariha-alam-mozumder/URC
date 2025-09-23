
const ORDER = ["ACCEPT", "MINOR_REVISIONS", "MAJOR_REVISIONS", "REJECT"]; /
export function aggregateDecision(decisions) {
  const counts = { ACCEPT: 0, REJECT: 0, MINOR_REVISIONS: 0, MAJOR_REVISIONS: 0 };
  for (const d of decisions) if (counts[d] !== undefined) counts[d]++;

  const total = Object.values(counts).reduce((a,b)=>a+b,0);
  if (!total) return null;
T
  if (counts.REJECT > Math.max(counts.ACCEPT, counts.MINOR_REVISIONS, counts.MAJOR_REVISIONS)) {
    return "REJECT";
  }

  if (counts.ACCEPT > (counts.MINOR_REVISIONS + counts.MAJOR_REVISIONS)) {
    return "ACCEPT";
  }

  const minPlusMaj = counts.MINOR_REVISIONS + counts.MAJOR_REVISIONS;
  if (minPlusMaj >= Math.floor(total/2) + 1 || minPlusMaj >= Math.ceil(total/2)) {
    return counts.MAJOR_REVISIONS >= counts.MINOR_REVISIONS ? "MAJOR_REVISIONS" : "MINOR_REVISIONS";
  }

  const maxCount = Math.max(counts.ACCEPT, counts.MINOR_REVISIONS, counts.MAJOR_REVISIONS, counts.REJECT);
  const tied = ORDER.filter(k => counts[k] === maxCount);
  const severity = { ACCEPT: 0, MINOR_REVISIONS: 1, MAJOR_REVISIONS: 2, REJECT: 3 };
  return tied.sort((a,b)=>severity[b]-severity[a])[0];
}
