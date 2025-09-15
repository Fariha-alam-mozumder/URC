// controllers/admin/StatusDistributionController.js
import prisma from "../../DB/db.config.js";

const StatusDistributionController = {
  async getDistribution(req, res) {
    try {
      const paperStatuses = await prisma.paper.groupBy({
        by: ["status"],
        _count: { status: true },
      });

      const proposalStatuses = await prisma.proposal.groupBy({
        by: ["status"],
        _count: { status: true },
      });

      // Merge counts by status
      const statusCounts = {};

      paperStatuses.forEach((p) => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + p._count.status;
      });

      proposalStatuses.forEach((p) => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + p._count.status;
      });

      const labels = Object.keys(statusCounts);
      const counts = labels.map((label) => statusCounts[label]);

      return res.json({ labels, counts });
    } catch (error) {
      console.error("Error fetching status distribution:", error);
      return res.status(500).json({ error: "Failed to fetch status distribution" });
    }
  },
};

export default StatusDistributionController;
