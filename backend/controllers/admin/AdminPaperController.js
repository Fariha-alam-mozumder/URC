// controllers/AdminPaperController.js
import prisma from "../../DB/db.config.js";
import { Vine, errors } from "@vinejs/vine";
import logger from "../../config/logger.js";
import { computeAdminAssignmentStatus } from "../../utils/assignmentAggregate.js";

const vine = new Vine();

// Helper: map enum to pretty label used by the UI + filters
const toPrettyDecision = (d) => {
  switch (d) {
    case "ACCEPT":
      return "Accepted";
    case "REJECT":
      return "Rejected";
    case "MAJOR_REVISIONS":
      return "Major Review";
    case "MINOR_REVISIONS":
      return "Minor Review";
    default:
      return "Under Review"; // when aggregated_decision is null
  }
};

class AdminPaperController {
  // GET /api/admin/papers - Get all papers for admin
  static async getAllPapers(req, res) {
    if (res.headersSent) {
      console.log("Response already sent, skipping");
      return;
    }
    try {
      const papers = await prisma.paper.findMany({
        include: {
          team: {
            include: {
              domain: {
                select: {
                  domain_id: true,
                  domain_name: true,
                },
              },
              teammember: {
                include: {
                  user: {
                    select: {
                      user_id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          teacher: {
            select: {
              teacher_id: true,
              designation: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
              department: {
                select: {
                  department_name: true,
                },
              },
            },
          },
          reviewerassignment: {
            select: {
              assignment_id: true,
              reviewer: {
                select: {
                  reviewer_id: true,
                  teacher: {
                    select: {
                      user: {
                        select: { name: true, email: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      const transformedPapers = await Promise.all(
        papers.map(async (paper) => {
          const members = paper.team?.teammember ?? [];

          const assignedReviewers = paper.reviewerassignment
            .map((a) => a.reviewer?.teacher?.user?.name)
            .filter(Boolean)
            .join(", ");

          const seen = new Set();
          const authors = members
            .filter((m) => {
              const key = m.user_id;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            })
            .map((m) => ({ name: m.user?.name || "Member" }));

          const adminStatus = await computeAdminAssignmentStatus(
            "paper",
            paper.paper_id
          );

          return {
            id: `P${String(paper.paper_id).padStart(3, "0")}`,
            title: paper.title || "Untitled",
            authors: authors.map((a) => a.name).join(", "),
            submittedBy: paper.teacher?.user?.name || "Unknown",
            department_name: paper.teacher?.department?.department_name || null,
            date: new Date(paper.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            status: toPrettyDecision(paper.aggregated_decision),
            reviewer: assignedReviewers || "Unassigned",
            team_name: paper.team?.team_name ?? null,
            domain_name: paper.team?.domain?.domain_name ?? null,
            pdf_path: paper.pdf_path || null,
            admin_assignment_status: adminStatus,
          };
        })
      );

      return res.status(200).json({
        success: true,
        papers: transformedPapers,
        total: transformedPapers.length,
      });
    } catch (error) {
      if (!res.headersSent) {
        logger.error("Error fetching all papers for admin:", error);
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }
    }
  }

  // GET /api/admin/proposals - Get all proposals for admin
  static async getAllProposals(req, res) {
    try {
      const proposals = await prisma.proposal.findMany({
        include: {
          team: {
            include: {
              domain: {
                select: {
                  domain_id: true,
                  domain_name: true,
                },
              },
              teammember: {
                include: {
                  user: {
                    select: {
                      user_id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          teacher: {
            select: {
              teacher_id: true,
              designation: true,
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
              department: {
                select: {
                  department_name: true,
                },
              },
            },
          },
          reviewerassignment: {
            select: {
              assignment_id: true,
              reviewer: {
                select: {
                  reviewer_id: true,
                  teacher: {
                    select: {
                      user: { select: { name: true, email: true } },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      const transformedProposals = await Promise.all(
        proposals.map(async (proposal) => {
          const members = proposal.team?.teammember ?? [];

          const assignedReviewers = proposal.reviewerassignment
            .map((a) => a.reviewer?.teacher?.user?.name)
            .filter(Boolean)
            .join(", ");

          const seen = new Set();
          const authors = members
            .filter((m) => {
              const key = m.user_id;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            })
            .map((m) => ({ name: m.user?.name || "Member" }));

          const adminStatus = await computeAdminAssignmentStatus(
            "proposal",
            proposal.proposal_id
          );

          return {
            id: `PR${String(proposal.proposal_id).padStart(3, "0")}`,
            title: proposal.title || "Untitled",
            authors: authors.map((a) => a.name).join(", "),
            submittedBy: proposal.teacher?.user?.name || "Unknown",
            department_name:
              proposal.teacher?.department?.department_name || null,
            date: new Date(proposal.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            // 👇 use aggregated_decision here too (pretty string)
            status: toPrettyDecision(proposal.aggregated_decision),
            reviewer: assignedReviewers || "Unassigned",
            team_name: proposal.team?.team_name ?? null,
            domain_name: proposal.team?.domain?.domain_name ?? null,
            pdf_path: proposal.pdf_path || null,
            admin_assignment_status: adminStatus,
          };
        })
      );

      return res.status(200).json({
        success: true,
        proposals: transformedProposals,
        total: transformedProposals.length,
      });
    } catch (error) {
      logger.error("Error fetching all proposals for admin:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
}

export default AdminPaperController;
