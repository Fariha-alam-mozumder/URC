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
  const paramRid =
    req.params && req.params.reviewer_id
      ? parseInt(req.params.reviewer_id, 10)
      : null;
  if (paramRid && Number.isInteger(paramRid)) return paramRid;

  if (req?.context?.reviewer_id) return req.context.reviewer_id;

  const userId = req?.user?.user_id ?? req?.user?.id;
  if (!userId) return null;

  const teacher = await prisma.teacher.findFirst({
    where: { user_id: userId },
    include: { reviewer: true },
  });

  return teacher?.reviewer?.reviewer_id ?? null;
};

class ReviewHistoryController {
  /**
   * GET /api/reviewer/review-history
   * GET /api/reviewer/history/:reviewer_id
   * Returns all submitted reviews by this reviewer
   * Supports search by title or team, status filter, and pagination
   */
  static async getReviewHistory(req, res) {
    try {
      const reviewer_id = await resolveReviewerId(req);
      if (!reviewer_id) {
        return res
          .status(403)
          .json({ success: false, message: "Unable to resolve reviewer identity." });
      }

      const { page, limit, skip } = parsePagination(req.query);
      const { search = "", status = "" } = req.query;

      // Build dynamic where clause
      const whereClause = {
        reviewer_id,
        OR: [
          { paper: { title: { contains: search, mode: "insensitive" } } },
          { proposal: { title: { contains: search, mode: "insensitive" } } },
          { paper: { team: { team_name: { contains: search, mode: "insensitive" } } } },
          { proposal: { team: { team_name: { contains: search, mode: "insensitive" } } } },
        ],
      };

      if (status) {
        // Map UI-friendly status to enum
        const decisionMap = {
          Approved: "ACCEPT",
          Rejected: "REJECT",
          "Needs Revision": ["MAJOR_REVISIONS", "MINOR_REVISIONS"],
          "Under Review": null,
        };
        const decision = decisionMap[status];
        if (decision) whereClause.decision = Array.isArray(decision) ? { in: decision } : decision;
      }

      const [total, reviews] = await Promise.all([
        prisma.review.count({ where: whereClause }),
        prisma.review.findMany({
          where: whereClause,
          include: {
            paper: {
              include: {
                teacher: { include: { user: { select: { name: true, email: true } } } },
                team: { include: { domain: true } },
              },
            },
            proposal: {
              include: {
                teacher: { include: { user: { select: { name: true, email: true } } } },
                team: { include: { domain: true } },
              },
            },
          },
          orderBy: { reviewed_at: "desc" },
          skip,
          take: limit,
        }),
      ]);

      const data = reviews.map((r) => {
        const target = r.paper ?? r.proposal;
        const isPaper = !!r.paper_id;
        const status = mapReviewDecisionToStatus(r.decision);
        const statusColorClass = getStatusColorClass(status);

        return {
          id: r.review_id,
          submission_id: (isPaper ? r.paper_id : r.proposal_id) ?? null,
          submission_type: isPaper ? "Paper" : "Proposal",
          title: target?.title ?? "Untitled",
          description: target?.abstract ?? "",
          domain: target?.team?.domain?.domain_name ?? null,
          team: target?.team?.team_name ?? null,
          submitted_by: target?.teacher?.user?.email ?? null,
          date: r.reviewed_at ? new Date(r.reviewed_at).toISOString() : null,
          status,
          statusColorClass,
          score: r.score ?? 0,
          attachment_path: r.attachment_path ?? null,
        };
      });

      return res.status(200).json({
        success: true,
        reviews: data,
        pagination: {
          current_page: page,
          per_page: limit,
          total_count: total,
          total_pages: Math.max(1, Math.ceil(total / limit)),
        },
      });
    } catch (error) {
      logger.error("Error getReviewHistory:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: error.message });
    }
  }

  /**
   * GET /api/reviewer/stats/:reviewer_id
   * GET /api/reviewer/stats/me
   * Returns reviewer statistics including total completed reviews
   */
  static async getReviewerStats(req, res) {
    try {
      const reviewer_id = await resolveReviewerId(req);
      if (!reviewer_id) {
        return res
          .status(403)
          .json({ success: false, message: "Unable to resolve reviewer identity." });
      }

      const reviews = await prisma.review.findMany({
        where: { reviewer_id },
        include: {
          paper: { select: { status: true } },
          proposal: { select: { status: true } },
        },
      });

      const totalCompleted = reviews.filter((r) => (r.paper ?? r.proposal)?.status === "COMPLETED").length;

      const approvedCount = reviews.filter((r) => r.decision === "ACCEPT").length;
      const rejectedCount = reviews.filter((r) => r.decision === "REJECT").length;
      const revisionCount = reviews.filter(
        (r) => r.decision === "MAJOR_REVISIONS" || r.decision === "MINOR_REVISIONS"
      ).length;

      const approvalRate = totalCompleted > 0 ? Math.round((approvedCount / totalCompleted) * 100) : 0;

      const avgReviewTime = 3.5; // Placeholder
      const documentsUploaded = reviews.filter((r) => !!r.attachment_path).length;

      const stats = {
        totalReviews: String(totalCompleted),
        avgReviewTime: String(avgReviewTime),
        approvalRate: `${approvalRate}%`,
        documentsUploaded: String(documentsUploaded),
      };

      return res.status(200).json({ success: true, stats, monthlyData: [], decisionDistribution: [] });
    } catch (error) {
      logger.error("Error fetching reviewer stats:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: error.message });
    }
  }

  /**
   * GET /api/reviewer/review-details/:review_id
   * Returns a single review with all submission details
   */
  static async getReviewDetails(req, res) {
    try {
      const { review_id } = req.params;

      const review = await prisma.review.findUnique({
        where: { review_id: parseInt(review_id, 10) },
        include: {
          reviewer: { include: { teacher: { include: { user: { select: { name: true, email: true } } } } } },
          paper: {
            include: {
              team: {
                include: {
                  domain: { select: { domain_name: true } },
                  teammember: { include: { user: { select: { name: true, email: true } } } },
                },
              },
              teacher: { include: { user: { select: { name: true, email: true } } } },
            },
          },
          proposal: {
            include: {
              team: {
                include: {
                  domain: { select: { domain_name: true } },
                  teammember: { include: { user: { select: { name: true, email: true } } } },
                },
              },
              teacher: { include: { user: { select: { name: true, email: true } } } },
            },
          },
        },
      });

      if (!review) return res.status(404).json({ success: false, message: "Review not found" });

      const isPaper = !!review.paper;
      const submission = isPaper ? review.paper : review.proposal;

      const transformedReview = {
        review_id: review.review_id,
        submission_type: isPaper ? "Paper" : "Proposal",
        submission_id: isPaper ? submission.paper_id : submission.proposal_id,
        title: submission.title,
        abstract: submission.abstract,
        team_name: submission.team?.team_name,
        domain_name: submission.team?.domain?.domain_name,
        team_members:
          submission.team?.teammember?.map((m) => ({
            name: m.user?.name,
            email: m.user?.email,
            role: m.role_in_team,
          })) || [],
        submitted_by: submission.teacher?.user?.name,
        submitter_email: submission.teacher?.user?.email,
        pdf_path: submission.pdf_path,
        created_at: submission.created_at,
        comments: review.comments,
        score: review.score,
        decision: review.decision,
        status: mapReviewDecisionToStatus(review.decision),
        attachment_path: review.attachment_path,
        reviewed_at: review.reviewed_at,
        reviewer_name: review.reviewer?.teacher?.user?.name,
      };

      return res.status(200).json({ success: true, review: transformedReview });
    } catch (error) {
      logger.error("Error fetching review details:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default ReviewHistoryController;
