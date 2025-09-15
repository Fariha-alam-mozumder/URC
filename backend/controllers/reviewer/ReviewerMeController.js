import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";
import { ACTIVE_ASSIGNMENT_STATUSES, countActiveAssignments, computeWorkloadPct } from "../../utils/workload.js";
import { autoAdjustReviewerStatus } from "../../utils/autoStatus.js";


function requireIntInRange(val, min, max) {
    const n = parseInt(val, 10);
    if (!Number.isInteger(n) || n < min || n > max) return null;
    return n;
}

class ReviewerMeController {
    static async resolveReviewerByUser(req) {
        // Assume req.user exists from auth middleware and has user_id
        const userId = req.user?.user_id;
        if (!userId) throw new Error("Unauthorized");

        const teacher = await prisma.teacher.findFirst({ where: { user_id: userId } });
        if (!teacher) throw new Error("Not a teacher");
        const reviewer = await prisma.reviewer.findUnique({ where: { teacher_id: teacher.teacher_id } });
        if (!reviewer) throw new Error("Not a reviewer");
        return reviewer;
    }

    // GET /reviewer/me/settings
    static async getSettings(req, res) {
        try {
            const reviewer = await ReviewerMeController.resolveReviewerByUser(req);

            const activeCount = await prisma.reviewerassignment.count({
                where: { reviewer_id: reviewer.reviewer_id, status: { in: ACTIVE_ASSIGNMENT_STATUSES } },
            });
            const pct = computeWorkloadPct(activeCount, reviewer.max_assignments ?? 5);

            return res.json({
                reviewer_id: reviewer.reviewer_id,
                status: reviewer.status,
                maxAssignments: reviewer.max_assignments ?? 5,
                activeAssignments: activeCount,
                workloadPct: pct,
                self_inactive: reviewer.self_inactive === true,
            });
        } catch (e) {
            logger.error("getSettings error:", e);
            return res.status(400).json({ error: e.message || "Failed to get settings" });
        }
    }

    // PUT /reviewer/me/settings  { maxAssignments?, status? }
    static async updateSettings(req, res) {
        try {
            const reviewer = await ReviewerMeController.resolveReviewerByUser(req);

            // Normalize inputs
            const bodyCap = req.body?.maxAssignments;
            const bodyStatus = req.body?.status; // "ACTIVE" | "INACTIVE"

            const updates = {};
            if (bodyCap !== undefined) {
                const cap = requireIntInRange(bodyCap, 1, 50); // pick the range you want
                if (cap === null) {
                    return res.status(400).json({ error: "maxAssignments must be an integer between 1 and 50" });
                }
                updates.max_assignments = cap;
            }
            // Get latest reviewer row for current values
            const current = await prisma.reviewer.findUnique({ where: { reviewer_id: reviewer.reviewer_id } });
            const capForEval = updates.max_assignments ?? current.max_assignments ?? 5;
            const activeCount = await prisma.reviewerassignment.count({
                where: { reviewer_id: reviewer.reviewer_id, status: { in: ACTIVE_ASSIGNMENT_STATUSES } },
            });
            const workloadPct = computeWorkloadPct(activeCount, capForEval);

            if (bodyStatus !== undefined) {
                const desired = String(bodyStatus).toUpperCase();
                if (!["ACTIVE", "INACTIVE"].includes(desired)) {
                    return res.status(400).json({ error: "status must be ACTIVE or INACTIVE" });
                }
                if (desired === "INACTIVE") {
                    // Reviewer self-pauses regardless of workload
                    updates.status = "INACTIVE";
                    updates.self_inactive = true;
                } else {
                    // desired === "ACTIVE"
                    // Cannot become ACTIVE if workload is 100%
                    if (workloadPct >= 100) {
                        return res.status(400).json({
                            error: "You are at full capacity; finish a review or increase max assignments first.",
                        });
                    }
                    updates.status = "ACTIVE";
                    updates.self_inactive = false;
                }
            }

            const updated = await prisma.reviewer.update({
                where: { reviewer_id: reviewer.reviewer_id },
                data: updates,
            });

            const activeCountt = await countActiveAssignments(prisma, reviewer.reviewer_id);
            return res.json({
                reviewer_id: updated.reviewer_id,
                status: updated.status,
                maxAssignments: updated.max_assignments ?? 5,
                activeAssignments: activeCountt,
                workloadPct: computeWorkloadPct(activeCountt, updated.max_assignments ?? 5),
                self_inactive: updated.self_inactive === true,
                message: "Settings updated",
            });
        } catch (e) {
            logger.error("updateSettings error:", e);
            return res.status(400).json({ error: e.message || "Failed to update settings" });
        }
    }
}
export default ReviewerMeController;
