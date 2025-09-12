import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";
import { Vine } from "@vinejs/vine";

const vine = new Vine();

class ReviewController {
  // GET /api/reviewer/assignments - Get reviewer’s assigned items
  static async getReviewerAssignments(req, res) {
    try {
      const reviewerId = req.user.reviewer_id; // from JWT middleware

      const assignments = await prisma.reviewerassignment.findMany({
        where: { reviewer_id: reviewerId },
        include: {
          paper: {
            include: {
              team: { include: { domain: true, teammember: { include: { user: true } } } },
            },
          },
          proposal: {
            include: {
              team: { include: { domain: true, teammember: { include: { user: true } } } },
            },
          },
        },
        orderBy: { assigned_date: "desc" },
      });

      // Transform for frontend
      const transformed = assignments.map((a) => {
        const item = a.paper || a.proposal;
        const type = a.paper ? "paper" : "proposal";
        const members = item?.team?.teammember ?? [];

        // Collect unique authors
        const seen = new Set();
        const authors = members.filter((m) => {
          if (seen.has(m.user_id)) return false;
          seen.add(m.user_id);
          return true;
        }).map((m) => ({
          name: m.user?.name || "Member",
          email: m.user?.email || null,
        }));

        return {
          assignment_id: a.assignment_id,
          item_id: item?.paper_id || item?.proposal_id,
          type,
          title: item?.title || `Untitled ${type}`,
          abstract: item?.abstract || "No abstract available",
          authors,
          status: a.status,
          assignedDate: new Date(a.assigned_date).toLocaleDateString(),
          dueDate: new Date(a.due_date).toLocaleDateString(),
          domain: item?.team?.domain?.domain_name || "Unknown",
          pdf_path: item?.pdf_path,
          reviewSubmitted: a.status === "COMPLETED",
        };
      });

      return res.status(200).json({
        success: true,
        data: transformed,
      });
    } catch (error) {
      logger.error("Error fetching reviewer assignments:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/reviewer/review - Submit a review
  static async submitReview(req, res) {
    try {
      const reviewerId = req.user.reviewer_id;
      const { assignment_id, comments, score, decision } = req.body;

      // Check assignment belongs to reviewer
      const assignment = await prisma.reviewerassignment.findUnique({
        where: { assignment_id },
        include: { reviewer: true },
      });

      if (!assignment || assignment.reviewer_id !== reviewerId) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }

      // Create review entry
      await prisma.$transaction(async (tx) => {
        await tx.review.create({
          data: {
            reviewer_id: reviewerId,
            proposal_id: assignment.proposal_id,
            paper_id: assignment.paper_id,
            comments,
            score,
            decision,
            reviewed_at: new Date(),
          },
        });

        // Update assignment status
        await tx.reviewerassignment.update({
          where: { assignment_id },
          data: { status: "COMPLETED" },
        });
      });

      return res.status(201).json({
        success: true,
        message: "Review submitted successfully",
      });
    } catch (error) {
      logger.error("Error submitting review:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/reviewer/stats - Reviewer dashboard stats
  static async getReviewerStats(req, res) {
    try {
      const reviewerId = req.user.reviewer_id;

      const [pending, inProgress, completed, overdue] = await Promise.all([
        prisma.reviewerassignment.count({ where: { reviewer_id: reviewerId, status: "PENDING" } }),
        prisma.reviewerassignment.count({ where: { reviewer_id: reviewerId, status: "IN_PROGRESS" } }),
        prisma.reviewerassignment.count({ where: { reviewer_id: reviewerId, status: "COMPLETED" } }),
        prisma.reviewerassignment.count({
          where: {
            reviewer_id: reviewerId,
            status: { in: ["PENDING", "IN_PROGRESS"] },
            due_date: { lt: new Date() },
          },
        }),
      ]);

      return res.status(200).json({
        success: true,
        stats: { pending, inProgress, completed, overdue },
      });
    } catch (error) {
      logger.error("Error fetching reviewer stats:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default ReviewController;
