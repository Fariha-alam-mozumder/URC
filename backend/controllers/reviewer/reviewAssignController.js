// controllers/reviewer/AssignedController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DashReviewerAssignedController {
  
  static async getAssignedPapers(req, res) {
    try {
      const userId = req.user.user_id; // from auth middleware
      // Find reviewer linked to this user (via teacher)
      const reviewer = await prisma.reviewer.findFirst({
        where: {
          teacher: { user_id: userId },
        },
      });

      if (!reviewer) {
        return res.status(404).json({ message: "Reviewer profile not found" });
      }

      const assignments = await prisma.reviewerassignment.findMany({
        where: { reviewer_id: reviewer.reviewer_id },
        include: {
          paper: {
            include: {
              teacher: { include: { user: true } },
            },
          },
          proposal: {
            include: {
              teacher: { include: { user: true } },
            },
          },
        },
        orderBy: { assigned_date: "desc" },
      });

      // Normalize data for frontend
      const formatted = assignments.map((a) => {
        const item = a.paper ?? a.proposal;
        const type = a.paper ? "Paper" : "Proposal";
        return {
          id: item?.paper_id ?? item?.proposal_id,
          title: item?.title,
          author: item?.teacher?.user?.name ?? "Unknown",
          status: a.status,
          dueDate: a.due_date,
          action: a.status === "PENDING" ? "Review" : "View",
          type,
        };
      });

      return res.json(formatted);
    } catch (error) {
      console.error("Error fetching assigned papers:", error);
      res.status(500).json({ message: "Failed to fetch assigned papers" });
    }
  }
}

export default DashReviewerAssignedController;
