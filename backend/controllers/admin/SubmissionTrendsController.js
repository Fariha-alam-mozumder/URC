// controllers/admin/SubmissionTrendsController.js
import prisma from "../../DB/db.config.js";

const SubmissionTrendsController = {
  async getTrends(req, res) {
    try {
      // Group papers and proposals by month (last 6 months for example)
      const papers = await prisma.paper.groupBy({
        by: ["created_at"],
        _count: { created_at: true },
      });

      const proposals = await prisma.proposal.groupBy({
        by: ["created_at"],
        _count: { created_at: true },
      });

      // Helper: convert to "YYYY-MM"
      const formatMonth = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      };

      // Aggregate counts per month
      const monthCounts = {};

      papers.forEach((p) => {
        const m = formatMonth(p.created_at);
        if (!monthCounts[m]) monthCounts[m] = { papers: 0, proposals: 0 };
        monthCounts[m].papers += p._count.created_at;
      });

      proposals.forEach((p) => {
        const m = formatMonth(p.created_at);
        if (!monthCounts[m]) monthCounts[m] = { papers: 0, proposals: 0 };
        monthCounts[m].proposals += p._count.created_at;
      });

      // Sort labels
      const labels = Object.keys(monthCounts).sort();

      const papersData = labels.map((m) => monthCounts[m].papers);
      const proposalsData = labels.map((m) => monthCounts[m].proposals);

      return res.json({ labels, papersData, proposalsData });
    } catch (error) {
      console.error("Error fetching submission trends:", error);
      return res.status(500).json({ error: "Failed to fetch submission trends" });
    }
  },
};

export default SubmissionTrendsController;
