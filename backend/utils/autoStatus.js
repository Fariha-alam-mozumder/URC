import prisma from "../DB/db.config.js";
import { ACTIVE_ASSIGNMENT_STATUSES, computeWorkloadPct } from "./workload.js";

export async function autoAdjustReviewerStatus(reviewer_id) {
  const r = await prisma.reviewer.findUnique({
    where: { reviewer_id },
    include: {
      reviewerassignment: { where: { status: { in: ACTIVE_ASSIGNMENT_STATUSES } }, select: { assignment_id: true } },
    },
  });
  if (!r) return;

  const activeCount = r.reviewerassignment.length;
  const pct = computeWorkloadPct(activeCount, r.max_assignments); // ← uses DB max_assignments

  if (pct >= 100 && r.status !== "INACTIVE") {
    await prisma.reviewer.update({ where: { reviewer_id }, data: { status: "INACTIVE" } });
    return;
  }
  if (pct < 100 && r.status !== "ACTIVE" && r.self_inactive === false) {
    await prisma.reviewer.update({ where: { reviewer_id }, data: { status: "ACTIVE" } });
  }
}
