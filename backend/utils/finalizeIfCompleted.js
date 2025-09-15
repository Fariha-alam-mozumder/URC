// backend/utils/finalizeIfCompleted.js
import prisma from "../DB/db.config.js";
import { computeAdminAssignmentStatus } from "./assignmentAggregate.js";
import { aggregateDecision } from "./decisionAggregate.js";

function mapDecisionToStatus(decision) {
  switch (decision) {
    case "ACCEPT": return "ACCEPTED";
    case "REJECT": return "REJECTED";
    case "MINOR_REVISIONS":
    case "MAJOR_REVISIONS":
    default: return "UNDER_REVIEW";
  }
}

/**
 * If the admin-facing assignment status is COMPLETED, aggregate decisions and persist.
 * @param {"paper"|"proposal"} kind
 * @param {number} id
 */
export async function finalizeIfCompleted(kind, id) {
  const adminStatus = await computeAdminAssignmentStatus(kind, id);
  if (adminStatus !== "COMPLETED") return { finalized: false, adminStatus };

  const whereReview = kind === "paper" ? { paper_id: id } : { proposal_id: id };
  const reviews = await prisma.review.findMany({
    where: whereReview,
    select: { decision: true }
  });

  const decisions = reviews
    .map(r => (r.decision || "").toUpperCase())
    .filter(d => ["ACCEPT","REJECT","MINOR_REVISIONS","MAJOR_REVISIONS"].includes(d));

  const agg = aggregateDecision(decisions);
  if (!agg) return { finalized: false, adminStatus };

  const now = new Date();
  if (kind === "paper") {
    await prisma.paper.update({
      where: { paper_id: id },
      data: {
        aggregated_decision: agg,
        aggregated_decided_at: now,
        status: mapDecisionToStatus(agg), // set final paper status based on aggregate
      }
    });
  } else {
    await prisma.proposal.update({
      where: { proposal_id: id },
      data: {
        aggregated_decision: agg,
        aggregated_decided_at: now,
        status: mapDecisionToStatus(agg),
      }
    });
  }

  return { finalized: true, adminStatus, aggregated: agg };
}
