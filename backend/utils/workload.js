export const ACTIVE_ASSIGNMENT_STATUSES = ["PENDING", "IN_PROGRESS"];

// Count active (pending + in_progress) assignments for a reviewer
export async function countActiveAssignments(prisma, reviewerId) {
  return prisma.reviewerassignment.count({
    where: { reviewer_id: reviewerId, status: { in: ACTIVE_ASSIGNMENT_STATUSES } },
  });
}

// Compute workload using the DB value for max_assignments
export function computeWorkloadPct(activeCount, maxAssignments) {
  const cap = Math.max(1, parseInt(maxAssignments ?? 5, 10)); // use DB value; 5 only as a *fallback*
  return Math.min(100, Math.round((activeCount / cap) * 100));
}
