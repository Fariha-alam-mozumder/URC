import prisma from "../../DB/db.config.js";

class ReviewerDashboardController {
  // 1. Overview counts
  static async getOverview(req, res) {
    try {
      const reviewerId = req.user.reviewer_id;

      const counts = await prisma.reviewerassignment.groupBy({
        by: ["status"],
        where: { reviewer_id: reviewerId },
        _count: { _all: true },
      });

      const overview = {
        PENDING: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
      };

      counts.forEach((c) => {
        overview[c.status] = c._count._all;
      });

      return res.json(overview);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch dashboard overview" });
    }
  }

  // 2. Assigned work (current)
  static async getAssignments(req, res) {
    try {
      const reviewerId = req.user.reviewer_id;

      const assignments = await prisma.reviewerassignment.findMany({
        where: { reviewer_id: reviewerId },
        include: {
          paper: { select: { paper_id: true, title: true, domain_id: true } },
          proposal: { select: { proposal_id: true, title: true, domain_id: true } },
        },
        orderBy: { created_at: "desc" },
      });

      return res.json(assignments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  }

  // 3. Completed history
  static async getHistory(req, res) {
    try {
      const reviewerId = req.user.reviewer_id;

      const history = await prisma.reviewerreview.findMany({
        where: { reviewer_id: reviewerId },
        include: {
          paper: { select: { title: true } },
          proposal: { select: { title: true } },
        },
        orderBy: { created_at: "desc" },
      });

      return res.json(history);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch review history" });
    }
  }
}

export default ReviewerDashboardController;
