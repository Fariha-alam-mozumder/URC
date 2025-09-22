// backend/controllers/reviewer/ReviewHistoryController.js
import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";

/**
 * Map ReviewDecision enum to UI-friendly status
 */
const mapReviewDecisionToStatus = (decision) => {
  switch (decision) {
    case "ACCEPT":
      return "Approved";
    case "REJECT":
      return "Rejected";
    case "MAJOR_REVISIONS":
    case "MINOR_REVISIONS":
      return "Needs Revision";
    default:
      return "Under Review";
  }
};

/**
 * Badge color helper for UI
 */
const getStatusColorClass = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-600";
    case "Rejected":
      return "bg-red-100 text-red-600";
    case "Needs Revision":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

/**
 * Basic pagination parser
 */
const parsePagination = (q = {}) => {
  const page = Math.max(1, parseInt(q.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(q.limit || "50", 10)));
  return { page, limit, skip: (page - 1) * limit };
};

/**
 * Resolve reviewer_id from:
 * 1) reviewerOnly middleware (req.context.reviewer_id)
 * 2) authenticated user -> teacher -> reviewer lookup
 * 3) optional :reviewer_id route param (if present and valid)
 */
const resolveReviewerId = async (req) => {
  // 3) explicit param (if route includes it)
  const paramRid =
    req.params && req.params.reviewer_id
      ? parseInt(req.params.reviewer_id, 10)
      : null;
  if (paramRid && Number.isInteger(paramRid)) return paramRid;

  // 1) middleware-provided context
  if (req?.context?.reviewer_id) return req.context.reviewer_id;

  const userId = req?.user?.user_id ?? req?.user?.id;
  if (!userId) return null;

  const teacher = await prisma.teacher.findFirst({
    where: { user_id: userId },
    include: { reviewer: true },
  });

  return teacher?.reviewer?.reviewer_id ?? null;
};

class ReviewDashboardController {
  static async getAssignmentStats(req, res) {
    try {
      const reviewer_id = await resolveReviewerId(req);
      if (!reviewer_id) {
        return res.status(403).json({
          success: false,
          message: "Unable to resolve reviewer identity.",
        });
      }

      // Count in one go
      const [total, pending, inProgress, completed, overdue] = await Promise.all([
        prisma.reviewerassignment.count({ where: { reviewer_id } }),
        prisma.reviewerassignment.count({
          where: { reviewer_id, status: "PENDING" },
        }),
        prisma.reviewerassignment.count({
          where: { reviewer_id, status: "IN_PROGRESS" },
        }),
        prisma.reviewerassignment.count({
          where: { reviewer_id, status: "COMPLETED" },
        }),
        prisma.reviewerassignment.count({
          where: { reviewer_id, status: "OVERDUE" },
        }),
      ]);

      return res.status(200).json({
        success: true,
        stats: {
          total,
          submitted: completed,     //"Submitted" = COMPLETED
          inProgress,
          pending,
          overdue,
        },
      });
    } catch (error) {
      logger.error("Error getAssignmentStats:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: error.message });
    }
  }

  // ======  /api/reviewer/assignments  ======
  static async getMyAssignments(req, res) {
    try {
      const reviewer_id = await resolveReviewerId(req);
      if (!reviewer_id) {
        return res.status(403).json({
          success: false,
          message: "Unable to resolve reviewer identity.",
        });
      }

      const { page, limit, skip } = parsePagination(req.query);
      const statusFilter = (req.query.status || "").trim();
      const where = {
        reviewer_id,
        ...(statusFilter ? { status: statusFilter } : {}),
      };

      const [total, rows] = await Promise.all([
        prisma.reviewerassignment.count({ where }),
        prisma.reviewerassignment.findMany({
          where,
          orderBy: { due_date: "asc" },
          include: {
            paper: {
              select: {
                paper_id: true,
                title: true,
                created_at: true,
                teacher: {
                  select: { user: { select: { name: true, email: true } } },
                },
              },
            },
            proposal: {
              select: {
                proposal_id: true,
                title: true,
                created_at: true,
                teacher: {
                  select: { user: { select: { name: true, email: true } } },
                },
              },
            },
          },
          skip,
          take: limit,
        }),
      ]);


      const data = rows.map((a) => {
        const isPaper = !!a.paper_id;
        const target = isPaper ? a.paper : a.proposal;

        // status
        const statusLabel = a.status
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase()); // "IN_PROGRESS" -> "In progress"

        // Decide which button to show
        const action =
          a.status === "COMPLETED" ? "View" : "Review";

        return {
          id: isPaper ? target?.paper_id : target?.proposal_id,
          title: target?.title ?? "—",
          author:
            target?.teacher?.user?.name ||
            target?.teacher?.user?.email ||
            "—",
          status: statusLabel,   
          dueDate: a.due_date,
          action,                     
        };
      });

      return res.status(200).json({
        success: true,
        assignments: data,
        pagination: {
          current_page: page,
          per_page: limit,
          total_count: total,
          total_pages: Math.max(1, Math.ceil(total / limit)),
        },
      });
    } catch (error) {
      logger.error("Error getMyAssignments:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default ReviewDashboardController;
