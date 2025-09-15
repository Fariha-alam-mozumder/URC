import prisma from "../../DB/db.config.js";
import { countActiveAssignments, computeWorkloadPct, ACTIVE_ASSIGNMENT_STATUSES } from "../../utils/workload.js";

async function resolveReviewerId(req) {
  // same logic you use in AssignedController.resolveReviewerId (you can import it instead)
  const u = req.user || {};
  if (u.reviewer_id) return u.reviewer_id;
  if (u.teacher_id) {
    const rv = await prisma.reviewer.findUnique({ where: { teacher_id: u.teacher_id }, select: { reviewer_id: true } });
    return rv?.reviewer_id ?? null;
  }
  if (u.user_id || u.id) {
    const teacher = await prisma.teacher.findFirst({ where: { user_id: (u.user_id ?? u.id) }, select: { teacher_id: true } });
    if (!teacher) return null;
    const rv = await prisma.reviewer.findUnique({ where: { teacher_id: teacher.teacher_id }, select: { reviewer_id: true } });
    return rv?.reviewer_id ?? null;
  }
  return null;
}

class SettingsController {
  // GET /api/reviewer/settings
  static async get(req, res) {
    const reviewer_id = await resolveReviewerId(req);
    if (!reviewer_id) return res.status(403).json({ success: false, message: "Reviewer not found" });

    const r = await prisma.reviewer.findUnique({ where: { reviewer_id }, select: { max_assignments: true, status: true, self_inactive: true } });
    const activeCount = await countActiveAssignments(prisma, reviewer_id);
    const workloadPct = computeWorkloadPct(activeCount, r.max_assignments);

    return res.json({ success: true, data: { ...r, activeCount, workloadPct } });
  }

  // PUT /api/reviewer/settings
  // Body: { max_assignments?: number, desired_status?: "ACTIVE"|"INACTIVE" }
  static async update(req, res) {
    const reviewer_id = await resolveReviewerId(req);
    if (!reviewer_id) return res.status(403).json({ success: false, message: "Reviewer not found" });

    const r = await prisma.reviewer.findUnique({ where: { reviewer_id } });
    if (!r) return res.status(404).json({ success: false, message: "Reviewer not found" });

    const payload = {
      max_assignments: req.body.max_assignments != null ? parseInt(req.body.max_assignments, 10) : null,
      desired_status: req.body.desired_status ?? null,
    };

    const updates = {};

    // Capacity change (allow 1..50; tune as you like)
    if (payload.max_assignments != null) {
      const cap = Math.max(1, Math.min(50, payload.max_assignments));
      updates.max_assignments = cap;
    }

    // Compute current workload to evaluate status change rules
    const activeCount = await prisma.reviewerassignment.count({
      where: { reviewer_id, status: { in: ACTIVE_ASSIGNMENT_STATUSES } },
    });
    const capForEval = updates.max_assignments ?? r.max_assignments ?? 5;
    const workloadPct = computeWorkloadPct(activeCount, capForEval);

    if (payload.desired_status === "INACTIVE") {
      // Reviewer can self-pause anytime
      updates.status = "INACTIVE";
      updates.self_inactive = true;
    } else if (payload.desired_status === "ACTIVE") {
      // Cannot become ACTIVE if workload is 100%
      if (workloadPct >= 100) {
        return res.status(400).json({ success: false, message: "You are at full capacity; finish a review or increase max assignments first." });
      }
      updates.status = "ACTIVE";
      updates.self_inactive = false;
    }

    const updated = await prisma.reviewer.update({ where: { reviewer_id }, data: updates });

    return res.json({
      success: true,
      message: "Settings updated",
      data: {
        max_assignments: updated.max_assignments,
        status: updated.status,
        self_inactive: updated.self_inactive,
        activeCount,
        workloadPct: computeWorkloadPct(activeCount, updated.max_assignments),
      },
    });
  }
}

export default SettingsController;
