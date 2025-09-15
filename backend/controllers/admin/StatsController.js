// controllers/admin/statslogic.js
import prisma from "../../DB/db.config.js";

const StatsController = {
  async getDashboardStats(req, res) {
    try {
      // Total papers + proposals
      const [totalPapers, totalProposals] = await Promise.all([
        prisma.paper.count(),
        prisma.proposal.count(),
      ]);
      const totalSubmissions = totalPapers + totalProposals;

      // Pending reviews (papers + proposals with status UNDER_REVIEW)
      const [pendingPapers, pendingProposals] = await Promise.all([
        prisma.paper.count({
          where: { status: "UNDER_REVIEW" },
        }),
        prisma.proposal.count({
          where: { status: "UNDER_REVIEW" },
        }),
      ]);
      const pendingReviews = pendingPapers + pendingProposals;

      // Assigned papers (only papers with reviewer assignments)
      const assignedPapers = await prisma.paper.count({
        where: {
          reviewerassignment: { some: {} }, // at least one assignment
        },
      });

      // Waiting assignment (papers + proposals with no assignments, still pending)
      const [waitingPapers, waitingProposals] = await Promise.all([
        prisma.paper.count({
          where: {
            status: "PENDING",
            reviewerassignment: { none: {} },
          },
        }),
        prisma.proposal.count({
          where: {
            status: "PENDING",
            reviewerassignment: { none: {} },
          },
        }),
      ]);
      const waitingAssignments = waitingPapers + waitingProposals;

      return res.json({
        totalSubmissions,
        pendingReviews,
        assignedPapers,
        waitingAssignments,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      return res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  },
};

export default StatsController;
