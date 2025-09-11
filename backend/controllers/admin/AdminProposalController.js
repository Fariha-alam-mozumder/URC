import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";

/**
 * Get all proposals with optional filters: search, status, track
 * Query params: search, status, track
 */
class AdminProposalController {
  // Class property with arrow function
  static async getAllProposals (req, res) {
    try {
      const { search = "", status, track } = req.query;

      const proposals = await prisma.proposal.findMany({
        where: {
          AND: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            status
              ? { status: status.toUpperCase() }
              : {},
            track
              ? {
                  domain: {
                    domain_name: { equals: track },
                  },
                }
              : {},
          ],
        },
        include: {
          teacher: {
            select: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
          domain: {
            select: {
              domain_name: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      // Transform to frontend-friendly format
      const response = proposals.map((p) => ({
        id: `P${p.proposal_id.toString().padStart(3, "0")}`,
        title: p.title,
        authors: p.teacher?.user?.name || "Unknown",
        submittedBy: p.teacher?.user?.email || "Unknown",
        date: p.created_at.toISOString().split("T")[0],
        status: p.status ? capitalizeStatus(p.status) : "Pending",
        reviewer: "Unassigned", // optional: you can fetch assigned reviewer here
        track: p.domain?.domain_name || "N/A",
      }));

      res.json({ success: true, data: response });
    } catch (error) {
      logger.error("Failed to fetch proposals", error);
      res.status(500).json({ success: false, message: "Failed to fetch proposals" });
    }
  };
}

// Helper to format status like "Under Review"
function capitalizeStatus(status) {
  if (!status) return "";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default AdminProposalController;
