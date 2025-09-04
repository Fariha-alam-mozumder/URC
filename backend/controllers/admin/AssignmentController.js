import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";
import { Vine, errors } from "@vinejs/vine";
import { getDocumentUrl } from "../../utils/helper.js";

import {
  assignReviewersSchema,
  autoMatchSchema,
} from "../../validations/admin/assignmentValidation.js";

const vine = new Vine();

class AssignmentController {
  // GET /api/assignments/waiting - Get papers/proposals waiting for reviewer assignment
  static async getWaitingAssignments(req, res) {
    try {
      // Get papers without assigned reviewers
      const papersWaiting = await prisma.paper.findMany({
        where: {
          reviewerassignment: {
            none: {},
          },
        },
        include: {
          teacher: {
            select: {
              teacher_id: true,
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
              domain_id: true,
              domain_name: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      // Get proposals without assigned reviewers
      const proposalsWaiting = await prisma.proposal.findMany({
        where: {
          reviewerassignment: {
            none: {},
          },
        },
        include: {
          teacher: {
            select: {
              teacher_id: true,
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
              domain_id: true,
              domain_name: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      // Transform papers to match frontend format
      const transformedPapers = papersWaiting.map((paper) => ({
        id: `P${String(paper.paper_id).padStart(3, "0")}`,
        actual_id: paper.paper_id,
        type: "paper",
        title: paper.title || "Untitled Paper",
        abstract: paper.abstract || "No abstract available",
        author: paper.teacher?.user?.name || "Unknown Author",
        authorEmail: paper.teacher?.user?.email || "Unknown",
        status: paper.status || "Pending",
        submissionDate: new Date(paper.created_at).toLocaleDateString(),
        domain: paper.domain?.domain_name || "Unknown",
        domain_id: paper.domain?.domain_id,
        file_path: getDocumentUrl(paper.file_path),
        viewUrl: `/admin/papers/${paper.paper_id}`,
        autoMatchAvailable: true,
      }));

      // Transform proposals to match frontend format
      const transformedProposals = proposalsWaiting.map((proposal) => ({
        id: `PR${String(proposal.proposal_id).padStart(3, "0")}`,
        actual_id: proposal.proposal_id,
        type: "proposal",
        title: proposal.title || "Untitled Proposal",
        abstract: proposal.abstract || "No abstract available",
        author: proposal.teacher?.user?.name || "Unknown Author",
        authorEmail: proposal.teacher?.user?.email || "Unknown",
        status: proposal.status || "Pending",
        submissionDate: new Date(proposal.created_at).toLocaleDateString(),
        domain: proposal.domain?.domain_name || "Unknown",
        domain_id: proposal.domain?.domain_id,
        file_path: getDocumentUrl(proposal.file_path),
        viewUrl: `/admin/proposals/${proposal.proposal_id}`,
        autoMatchAvailable: true, 
      }));

      // Combine both papers and proposals
      const waitingItems = [...transformedPapers, ...transformedProposals];

      // Get stats
      const availableReviewers = await prisma.reviewer.count({
        where: {
          status: "ACTIVE",
        },
      });

      const autoMatchAvailable = waitingItems.filter(
        (item) => item.autoMatchAvailable
      ).length;

      const stats = {
        awaitingAssignment: waitingItems.length,
        availableReviewers: availableReviewers,
        autoMatchAvailable: autoMatchAvailable,
      };

      return res.status(200).json({
        success: true,
        waitingItems: waitingItems,
        stats: stats,
        message: `Found ${waitingItems.length} items awaiting assignment`,
      });
    } catch (error) {
      logger.error("Error fetching waiting assignments:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching waiting assignments",
        error: error.message,
      });
    }
  }

  // GET /api/assignments/reviewers - Get available reviewers
  static async getAvailableReviewers(req, res) {
    try {
      const { domain_id, item_type, item_id } = req.query;

      // Base query for active reviewers
      let whereCondition = {
        status: "ACTIVE",
      };

      // If domain_id is provided, filter by domain expertise
      if (domain_id) {
        whereCondition.teacher = {
          department: {
            // Assuming reviewers should be from same domain or have expertise
            // Adjust this logic based on your domain matching requirements
          },
        };
      }

      const reviewers = await prisma.reviewer.findMany({
        where: whereCondition,
        include: {
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
          // Get current assignment count for workload balancing
          reviewerassignment: {
            where: {
              status: {
                in: ["PENDING", "IN_PROGRESS"],
              },
            },
          },
        },
      });

      // Transform for frontend
      const availableReviewers = reviewers.map((reviewer) => ({
        id: reviewer.reviewer_id,
        name: reviewer.teacher?.user?.name || "Unknown Reviewer",
        email: reviewer.teacher?.user?.email || "Unknown",
        designation: reviewer.teacher?.designation || "Unknown",
        department: reviewer.teacher?.department?.department_name || "Unknown",
        currentWorkload: reviewer.reviewerassignment?.length || 0,
        status: reviewer.status,
        expertise: [], // Can add expertise matching logic here
        matchScore: 0, // Can implement matching algorithm
      }));

      // Sort by workload (ascending) for balanced assignment
      availableReviewers.sort((a, b) => a.currentWorkload - b.currentWorkload);

      return res.status(200).json({
        success: true,
        data: availableReviewers,
        total: availableReviewers.length,
      });
    } catch (error) {
      logger.error("Error fetching available reviewers:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching reviewers",
        error: error.message,
      });
    }
  }

  // POST /api/assignments/assign - Assign reviewers to papers/proposals
  static async assignReviewers(req, res) {
    try {
      // Validate input
      const validator = vine.compile(assignReviewersSchema);
      const payload = await validator.validate(req.body);

      const { assignments } = payload;

      const results = [];

      // Process each assignment
      for (const assignment of assignments) {
        const { item_id, item_type, reviewer_ids } = assignment;

        if (
          !item_id ||
          !item_type ||
          !reviewer_ids ||
          !Array.isArray(reviewer_ids)
        ) {
          results.push({
            item_id,
            success: false,
            message: "Invalid assignment data",
          });
          continue;
        }

        try {
          // Create reviewer assignments
          const assignmentPromises = reviewer_ids.map((reviewer_id) =>
            prisma.reviewerAssignment.create({
              data: {
                reviewer_id: parseInt(reviewer_id),
                paper_id: item_type === "paper" ? parseInt(item_id) : null,
                proposal_id:
                  item_type === "proposal" ? parseInt(item_id) : null,
                assigned_date: new Date(),
                status: "PENDING",
                due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
              },
            })
          );

          await Promise.all(assignmentPromises);

          // Update the paper/proposal status to "Under Review"
          if (item_type === "paper") {
            await prisma.paper.update({
              where: { paper_id: parseInt(item_id) },
              data: { status: "Under Review" },
            });
          } else {
            await prisma.proposal.update({
              where: { proposal_id: parseInt(item_id) },
              data: { status: "Under Review" },
            });
          }

          results.push({
            item_id,
            success: true,
            message: `Successfully assigned ${reviewer_ids.length} reviewers`,
          });
        } catch (assignmentError) {
          logger.error(
            `Error assigning reviewers to ${item_type} ${item_id}:`,
            assignmentError
          );
          results.push({
            item_id,
            success: false,
            message: "Failed to assign reviewers",
          });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const totalCount = results.length;

      return res.status(200).json({
        success: successCount > 0,
        message: `Successfully processed ${successCount}/${totalCount} assignments`,
        results: results,
      });
    } catch (error) {
      logger.error("Error in assignReviewers:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while assigning reviewers",
        error: error.message,
      });
    }
  }

  // POST /api/assignments/auto-match - Auto-match reviewers based on expertise/workload
  static async autoMatchReviewers(req, res) {
    try {
      // Validate input
      const validator = vine.compile(autoMatchSchema);
      const payload = await validator.validate(req.body);

      const { item_id, item_type } = payload;

      // Get the item details
      let item;
      if (item_type === "paper") {
        item = await prisma.paper.findUnique({
          where: { paper_id: parseInt(item_id) },
          include: {
            domain: true,
            teacher: {
              include: {
                user: true,
              },
            },
          },
        });
      } else {
        item = await prisma.proposal.findUnique({
          where: { proposal_id: parseInt(item_id) },
          include: {
            domain: true,
            teacher: {
              include: {
                user: true,
              },
            },
          },
        });
      }

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      // Get available reviewers (excluding the author if they're a reviewer)
      const availableReviewers = await prisma.reviewer.findMany({
        where: {
          status: "ACTIVE",
          teacher_id: {
            not: item.teacher_id, // Exclude the author
          },
        },
        include: {
          teacher: {
            include: {
              user: true,
              department: true,
            },
          },
          reviewerassignment: {
            where: {
              status: {
                in: ["PENDING", "IN_PROGRESS"],
              },
            },
          },
        },
      });

      // Simple matching algorithm based on workload
      // In a real system, you'd implement domain expertise matching
      const reviewersWithScore = availableReviewers.map((reviewer) => {
        const currentWorkload = reviewer.reviewerassignment?.length || 0;
        const maxWorkload = 5; // Assume max 5 concurrent reviews

        // Simple scoring: prefer reviewers with lower workload
        const workloadScore = Math.max(
          0,
          (maxWorkload - currentWorkload) / maxWorkload
        );

        // Could add domain expertise matching here
        const domainScore = 0.5; // Placeholder

        const totalScore = workloadScore * 0.7 + domainScore * 0.3;

        return {
          ...reviewer,
          score: totalScore,
          workload: currentWorkload,
        };
      });

      // Sort by score (descending) and take top 2-3 reviewers
      const recommendedReviewers = reviewersWithScore
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((reviewer) => ({
          id: reviewer.reviewer_id,
          name: reviewer.teacher?.user?.name || "Unknown",
          email: reviewer.teacher?.user?.email || "Unknown",
          department:
            reviewer.teacher?.department?.department_name || "Unknown",
          workload: reviewer.workload,
          score: reviewer.score,
        }));

      if (recommendedReviewers.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No suitable reviewers available for auto-assignment",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Found ${recommendedReviewers.length} recommended reviewers`,
        recommendations: recommendedReviewers,
        item_id: item_id,
        item_type: item_type,
      });
    } catch (error) {
      logger.error("Error in auto-match reviewers:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during auto-matching",
        error: error.message,
      });
    }
  }
}

export default AssignmentController;
