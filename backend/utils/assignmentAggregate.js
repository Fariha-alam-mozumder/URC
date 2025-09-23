import prisma from "../DB/db.config.js";

export async function computeAdminAssignmentStatus(kind, id) {
  const where = kind === "paper" ? { paper_id: id } : { proposal_id: id };
  const assignments = await prisma.reviewerassignment.findMany({
    where,
    select: { status: true, started_at: true, completed_at: true, due_date: true }
  });

  if (!assignments.length) return "PENDING"; 

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

  if (completed === total) return "COMPLETED";

  if (beforeDue) {
    if (notStarted > 0) return "PENDING";
    if (inProgress > 0) return "IN_PROGRESS";
    return completed > 0 ? "IN_PROGRESS" : "PENDING";
  }

  const completedRatio = completed / total;
  return completedRatio > 0.5 ? "COMPLETED" : "OVERDUE";
}
