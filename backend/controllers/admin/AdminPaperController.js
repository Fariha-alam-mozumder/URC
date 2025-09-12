import prisma from "../../DB/db.config.js";

import { Vine, errors } from "@vinejs/vine";
import logger from "../../config/logger.js";

const vine = new Vine();

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
                  status: true,
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
                },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      // Transform data to match your frontend format
      const transformedPapers = papers.map((paper) => {
               const members = paper.team?.teammember ?? [];
        // Get assigned reviewers
        const assignedReviewers = paper.reviewerassignment
          .map((assignment) => assignment.reviewer?.teacher?.user?.name)
          .filter((name) => name)
          .join(", ");

        const seen = new Set();
        const authors = members
          .filter((m) => {
            const key = m.user_id;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })

          .map((m) => ({
            name: m.user?.name || "Member",
            // email: m.user?.email || null,
          }));

        return {
          id: `P${String(paper.paper_id).padStart(3, "0")}`,
          title: paper.title || "Untitled",
          authors: authors.map((a) => a.name).join(", "),// legacy string
          submittedBy: paper.teacher?.user?.name || "Unknown",
          date: new Date(paper.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
          status: paper.status || "Pending",
          reviewer: assignedReviewers || "Unassigned",
          team_name: paper.team?.team_name ?? null,
          domain_name: paper.team?.domain?.domain_name ?? null,
          pdf_path: paper.pdf_path || null, 
        };
      });

      // Fixed: Match frontend expectation - use 'papers' instead of 'data'
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
                status: true,
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
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Transform data
    const transformedProposals = proposals.map((proposal) => {
      const members = proposal.team?.teammember ?? [];

      // Get assigned reviewers
      const assignedReviewers = proposal.reviewerassignment
        .map((assignment) => assignment.reviewer?.teacher?.user?.name)
        .filter((name) => name)
        .join(", ");

      const seen = new Set();
      const authors = members
        .filter((m) => {
          const key = m.user_id;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((m) => ({
          name: m.user?.name || "Member",
        }));

      return {
        id: `PR${String(proposal.proposal_id).padStart(3, "0")}`,
        title: proposal.title || "Untitled",
        authors: authors.map((a) => a.name).join(", "), // legacy string for table
        submittedBy: proposal.teacher?.user?.name || "Unknown",
        date: new Date(proposal.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        status: proposal.status || "Pending",
        reviewer: assignedReviewers || "Unassigned",
        team_name: proposal.team?.team_name ?? null,
        domain_name: proposal.team?.domain?.domain_name ?? null,
        pdf_path: proposal.pdf_path || null, // ✅ add PDF path like papers
      };
    });

    return res.status(200).json({
      success: true,
      proposals: transformedProposals, // ✅ rename to proposals
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