// backend/utils/assignmentAggregate.js
import prisma from "../DB/db.config.js";

/**
 * Compute the ADMIN-FACING assignment status for a single paper/proposal,
 * following the 4 rules.
 *
 * @param {"paper"|"proposal"} kind
 * @param {number} id
 * @returns {Promise<"PENDING"|"IN_PROGRESS"|"COMPLETED"|"OVERDUE">}
 */
export async function computeAdminAssignmentStatus(kind, id) {
  const where = kind === "paper" ? { paper_id: id } : { proposal_id: id };
  const assignments = await prisma.reviewerassignment.findMany({
    where,
    select: { status: true, started_at: true, completed_at: true, due_date: true }
  });

  if (!assignments.length) return "PENDING"; 

  // All assignments share the same due_date in your UI; take max just in case.
  const due = assignments.reduce((acc, a) => {
    const d = a.due_date?.getTime?.() ?? new Date(a.due_date).getTime();
    return Math.max(acc, d || 0);
  }, 0);
  const now = Date.now();
  const beforeDue = now <= due;

  const total = assignments.length;
  const completed = assignments.filter(a => a.status === "COMPLETED" && a.completed_at && (a.completed_at.getTime?.() ?? new Date(a.completed_at).getTime()) <= due).length;
  const inProgress = assignments.filter(a => a.status === "IN_PROGRESS").length;
  const notStarted = assignments.filter(a => a.status === "PENDING").length;

  // Rule 4: all reviewers completed within due date
  if (completed === total) return "COMPLETED";

  if (beforeDue) {
    // Rule 1: any reviewer didn't start (still PENDING) within due date → show PENDING
    if (notStarted > 0) return "PENDING";
    // Rule 2: any reviewer is IN_PROGRESS within due date → show IN_PROGRESS
    if (inProgress > 0) return "IN_PROGRESS";
    // Fallback
    return completed > 0 ? "IN_PROGRESS" : "PENDING";
  }

  // After due date passed:
  // Rule 3: >50% completed → COMPLETED else OVERDUE
  const completedRatio = completed / total;
  return completedRatio > 0.5 ? "COMPLETED" : "OVERDUE";
}
