// controllers/admin/ReviewerWorkloadController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReviewerWorkloadController {
  /**
   * GET /admin/reviewer-workload
   * Returns reviewer workload stats
   */
  static async getReviewerWorkload(req, res) {
    try {
      const reviewers = await prisma.reviewer.findMany({
        where: { status: "ACTIVE" },
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          reviewerassignment: true,
        },
      });

      const data = reviewers.map((rev) => {
        const assigned = rev.reviewerassignment.length;
        const completed = rev.reviewerassignment.filter(
          (a) => a.status === "COMPLETED"
        ).length;
        const pending = rev.reviewerassignment.filter(
          (a) => a.status === "PENDING" || a.status === "IN_PROGRESS"
        ).length;

        // calculate average time (dummy for now, could refine with reviewed_at - assigned_date)
        const avgTimeDays = assigned > 0 ? 5 : 0;

        return {
          id: rev.reviewer_id,
          name: rev.teacher?.user?.name || "Unnamed Reviewer",
          assigned,
          completed,
          pending,
          avgTimeDays,
        };
      });

      res.json({ reviewers: data });
    } catch (err) {
      console.error("Error fetching reviewer workload:", err);
      res.status(500).json({ error: "Failed to fetch reviewer workload" });
    }
  }
}

export default ReviewerWorkloadController;
