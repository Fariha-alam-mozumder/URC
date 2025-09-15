// utils/finalizeIfCompleted.js
import prisma from "../DB/db.config.js";
import { computeAdminAssignmentStatus } from "./assignmentAggregate.js";
import { aggregateDecision } from "./decisionAggregate.js";

/**
 * When ALL assigned reviews are completed for a paper/proposal:
 * 1) Aggregate ReviewDecision[] using your rule-set
 * 2) Persist aggregated_decision + aggregated_decided_at
 * 3) Set status = COMPLETED (new enum: PENDING | COMPLETED | UNDER_REVIEW)
 *
 * @param {"paper"|"proposal"} kind
 * @param {number} id
 * @returns {Promise<{ finalized: boolean, adminStatus: string, aggregated?: "ACCEPT"|"REJECT"|"MINOR_REVISIONS"|"MAJOR_REVISIONS" }>}
 */
export async function finalizeIfCompleted(kind, id) {
  const adminStatus = await computeAdminAssignmentStatus(kind, id);
  if (adminStatus !== "COMPLETED") {
    return { finalized: false, adminStatus };
  }

  const whereReview = kind === "paper" ? { paper_id: id } : { proposal_id: id };
  const reviews = await prisma.review.findMany({
    where: whereReview,
    select: { decision: true },
  });

  const decisions = reviews
    .map((r) => (r.decision || "").toUpperCase())
    .filter((d) =>
      ["ACCEPT", "REJECT", "MINOR_REVISIONS", "MAJOR_REVISIONS"].includes(d)
    );

  const agg = aggregateDecision(decisions);
  if (!agg) return { finalized: false, adminStatus };

  const now = new Date();

  if (kind === "paper") {
    await prisma.paper.update({
      where: { paper_id: id },
      data: {
        aggregated_decision: agg,
        aggregated_decided_at: now,
        status: "COMPLETED", // <<— NEW: always COMPLETED when final decision is stored
      },
    });
  } else {
    await prisma.proposal.update({
      where: { proposal_id: id },
      data: {
        aggregated_decision: agg,
        aggregated_decided_at: now,
        status: "COMPLETED", // <<— NEW: always COMPLETED when final decision is stored
      },
    });
  }

  return { finalized: true, adminStatus, aggregated: agg };
}
