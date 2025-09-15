// controllers/admin/AssignmentController.js
import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";
import { Vine } from "@vinejs/vine";
import { getDocumentUrl } from "../../utils/helper.js";
import {
  assignReviewersSchema,
  autoMatchSchema,
} from "../../validations/admin/assignmentValidation.js";

const vine = new Vine();

/**
 * Helper: load context for a paper/proposal:
 * - domain_id
 * - submitting teacher (teacher_id & user_id)
 * - team_user_ids (all authors/members' user_id)
 */
async function getItemContext(prismaClient, item_type, item_id) {
  if (String(item_type) === "paper") {
    const p = await prismaClient.paper.findUnique({
      where: { paper_id: parseInt(item_id, 10) },
      include: {
        teacher: { select: { teacher_id: true, user_id: true } },
        team: {
          select: {
            team_id: true,
            domain: { select: { domain_id: true } },
            teammember: { select: { user_id: true } },
          },
        },
      },
    });
    if (!p) return null;
    return {
      domain_id: p.team?.domain?.domain_id ?? null,
      submitting_teacher_id: p.teacher?.teacher_id ?? null,
      submitting_teacher_user_id: p.teacher?.user_id ?? null,
      team_user_ids: (p.team?.teammember || []).map((m) => Number(m.user_id)),
      team_id: p.team?.team_id ?? null,
      raw: p,
    };
  } else {
    const pr = await prismaClient.proposal.findUnique({
      where: { proposal_id: parseInt(item_id, 10) },
      include: {
        teacher: { select: { teacher_id: true, user_id: true } },
        team: {
          select: {
            team_id: true,
            domain: { select: { domain_id: true } },
            teammember: { select: { user_id: true } },
          },
        },
      },
    });
    if (!pr) return null;
    return {
      domain_id: pr.team?.domain?.domain_id ?? null,
      submitting_teacher_id: pr.teacher?.teacher_id ?? null,
      submitting_teacher_user_id: pr.teacher?.user_id ?? null,
      team_user_ids: (pr.team?.teammember || []).map((m) => Number(m.user_id)),
      team_id: pr.team?.team_id ?? null,
      raw: pr,
    };
  }
}

class AssignmentController {
  // GET /api/assignments/waiting - Get papers/proposals waiting for reviewer assignment
  static async getWaitingAssignments(req, res) {
    try {
      // Papers with no reviewerassignment
      const papersWaiting = await prisma.paper.findMany({
        where: { reviewerassignment: { none: {} } },
        include: {
          team: {
            include: {
              domain: { select: { domain_id: true, domain_name: true } },
              teammember: {
                include: {
                  user: { select: { user_id: true, name: true, email: true } },
                },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      // Proposals with no reviewerassignment
      const proposalsWaiting = await prisma.proposal.findMany({
        where: { reviewerassignment: { none: {} } },
        include: {
          team: {
            include: {
              domain: { select: { domain_id: true, domain_name: true } },
              teammember: {
                include: {
                  user: { select: { user_id: true, name: true, email: true } },
                },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      const transformedPapers = papersWaiting.map((paper) => {
        const members = paper.team?.teammember ?? [];
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
            email: m.user?.email || null,
          }));

        return {
          id: `P${String(paper.paper_id).padStart(3, "0")}`,
          actual_id: paper.paper_id,
          type: "paper",
          title: paper.title || "Untitled Paper",
          abstract: paper.abstract || "No abstract available",
          author: authors.map((a) => a.name).join(", "),
          authors,
          authorEmail: null,
          status: paper.status || "Pending",
          submissionDate: new Date(paper.created_at).toLocaleDateString(),
          domain: paper.team?.domain?.domain_name || "Unknown",
          domain_id: paper.team?.domain?.domain_id || null,
          pdf_path: getDocumentUrl(paper.pdf_path),
          viewUrl: `/admin/papers/${paper.paper_id}`,
          autoMatchAvailable: true,
        };
      });

      const transformedProposals = proposalsWaiting.map((proposal) => {
        const members = proposal.team?.teammember ?? [];
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
            email: m.user?.email || null,
          }));

        return {
          id: `PR${String(proposal.proposal_id).padStart(3, "0")}`,
          actual_id: proposal.proposal_id,
          type: "proposal",
          title: proposal.title || "Untitled proposal",
          abstract: proposal.abstract || "No abstract available",
          author: authors.map((a) => a.name).join(", "),
          authors,
          authorEmail: null,
          status: proposal.status || "Pending",
          submissionDate: new Date(proposal.created_at).toLocaleDateString(),
          domain: proposal.team?.domain?.domain_name || "Unknown",
          domain_id: proposal.team?.domain?.domain_id || null,
          pdf_path: getDocumentUrl(proposal.pdf_path),
          viewUrl: `/admin/proposals/${proposal.proposal_id}`,
          autoMatchAvailable: true,
        };
      });

      const waitingItems = [...transformedPapers, ...transformedProposals];

      const availableReviewers = await prisma.reviewer.count({
        where: { status: "ACTIVE" },
      });

      const autoMatchAvailable = waitingItems.filter(
        (item) => item.autoMatchAvailable
      ).length;

      const stats = {
        awaitingAssignment: waitingItems.length,
        availableReviewers,
        autoMatchAvailable,
      };

      return res.status(200).json({
        success: true,
        waitingItems,
        stats,
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

  // GET /api/assignments/reviewers - Get available reviewers (excludes conflicts)
  static async getAvailableReviewers(req, res) {
    try {
      const { domain_id, item_type, item_id } = req.query;

      // Load context (if provided) to exclude conflicts
      let ctx = null;
      if (item_type && item_id) {
        ctx = await getItemContext(prisma, String(item_type), parseInt(item_id, 10));
        if (!ctx) {
          return res
            .status(404)
            .json({ success: false, message: "Item not found" });
        }
      }

      // Base query: ACTIVE reviewers (+ optional domain filtering)
      let whereCondition = { status: "ACTIVE" };
      if (domain_id) {
        whereCondition.teacher = {
          user: {
            userdomain: {
              some: { domain_id: parseInt(domain_id, 10) },
            },
          },
        };
      }

      const reviewers = await prisma.reviewer.findMany({
        where: whereCondition,
        include: {
          teacher: {
            select: {
              teacher_id: true,
              user_id: true, // for direct compare when present in schema
              designation: true,
              user: {
                select: {
                  user_id: true, // ensure available for team-member check
                  name: true,
                  email: true,
                  userdomain: {
                    include: {
                      domain: { select: { domain_id: true, domain_name: true } },
                    },
                  },
                },
              },
              department: { select: { department_name: true } },
            },
          },
          reviewerassignment: {
            where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
          },
        },
      });

      // === Exclude conflicts: submitting teacher + any team member/author ===
      const teamUserSet = new Set(ctx?.team_user_ids || []);
      const submittingTeacherId = ctx?.submitting_teacher_id ?? null;

      const filtered = reviewers.filter((rev) => {
        // exclude submitting teacher
        if (submittingTeacherId && rev.teacher?.teacher_id === submittingTeacherId) {
          return false;
        }
        // exclude team members (by underlying user_id)
        const uid =
          Number(rev.teacher?.user?.user_id) ||
          Number(rev.teacher?.user_id) ||
          null;
        if (uid && teamUserSet.has(uid)) {
          return false;
        }
        return true;
      });

      // Transform for frontend
      const availableReviewers = filtered.map((reviewer) => ({
        id: reviewer.reviewer_id,
        name: reviewer.teacher?.user?.name || "Unknown Reviewer",
        email: reviewer.teacher?.user?.email || "Unknown",
        designation: reviewer.teacher?.designation || "Unknown",
        department: reviewer.teacher?.department?.department_name || "Unknown",
        currentWorkload: reviewer.reviewerassignment?.length || 0,
        status: reviewer.status,
        expertise:
          reviewer.teacher?.user?.userdomain?.map(
            (ud) => ud.domain.domain_name
          ) || [],
        domainIds:
          reviewer.teacher?.user?.userdomain?.map(
            (ud) => ud.domain.domain_id
          ) || [],
        matchScore: domain_id
          ? reviewer.teacher?.user?.userdomain?.some(
              (ud) => ud.domain_id === parseInt(domain_id, 10)
            )
            ? 1
            : 0
          : 0,
      }));

      // Sort: domain match desc, then workload asc
      availableReviewers.sort((a, b) => {
        if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
        return a.currentWorkload - b.currentWorkload;
      });

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

  // POST /api/assignments/assign - Assign reviewers to papers/proposals (blocks conflicts)
  static async assignReviewers(req, res) {
    try {
      // Validate input
      const validator = vine.compile(assignReviewersSchema);
      const payload = await validator.validate(req.body);
      const { assignments } = payload;

      const minRequired = 3;
      for (const a of assignments || []) {
        const ids = Array.isArray(a.reviewer_ids) ? a.reviewer_ids : [];
        if (ids.length < minRequired) {
          return res.status(400).json({
            success: false,
            message: `At least ${minRequired} reviewers are required for each ${a.item_type || "item"}.`,
          });
        }
      }

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

        // Load context for conflict checks
        const ctx = await getItemContext(prisma, String(item_type), parseInt(item_id, 10));
        if (!ctx) {
          results.push({ item_id, success: false, message: "Item not found" });
          continue;
        }
        const teamUserSet = new Set(ctx.team_user_ids || []);
        const submittingTeacherId = ctx.submitting_teacher_id;

        // Load selected reviewers quickly
        const selectedReviewers = await prisma.reviewer.findMany({
          where: { reviewer_id: { in: reviewer_ids.map((r) => parseInt(r, 10)) } },
          select: {
            reviewer_id: true,
            teacher: {
              select: {
                teacher_id: true,
                user_id: true,
                user: { select: { user_id: true, name: true } },
              },
            },
          },
        });

        // Conflict detection
        const conflicts = [];
        for (const r of selectedReviewers) {
          const tid = r.teacher?.teacher_id;
          const uid =
            Number(r.teacher?.user?.user_id) ||
            Number(r.teacher?.user_id) ||
            null;
          const name = r.teacher?.user?.name || `Reviewer#${r.reviewer_id}`;

          if (submittingTeacherId && tid === submittingTeacherId) {
            conflicts.push({
              reviewer_id: r.reviewer_id,
              reason: `${name} is the submitting teacher.`,
            });
            continue;
          }
          if (uid && teamUserSet.has(uid)) {
            conflicts.push({
              reviewer_id: r.reviewer_id,
              reason: `${name} is a member/author of this team.`,
            });
          }
        }

        if (conflicts.length > 0) {
          results.push({
            item_id,
            success: false,
            message:
              "Conflict of interest detected:\n" +
              conflicts.map((c) => `- ${c.reason}`).join("\n"),
          });
          continue; // do not create assignments for this item
        }

        // Create assignments
        try {
          await prisma.$transaction(async (tx) => {
            await Promise.all(
              reviewer_ids.map((reviewer_id) =>
                tx.reviewerassignment.create({
                  data: {
                    reviewer_id: parseInt(reviewer_id, 10),
                    paper_id:
                      item_type === "paper" ? parseInt(item_id, 10) : null,
                    proposal_id:
                      item_type === "proposal" ? parseInt(item_id, 10) : null,
                    assigned_date: new Date(),
                    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    status: "PENDING",
                  },
                })
              )
            );

            // Update parent status to UNDER_REVIEW
            if (item_type === "paper") {
              await tx.paper.update({
                where: { paper_id: parseInt(item_id, 10) },
                data: { status: "UNDER_REVIEW" },
              });
            } else {
              await tx.proposal.update({
                where: { proposal_id: parseInt(item_id, 10) },
                data: { status: "UNDER_REVIEW" },
              });
            }
          });

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
        results,
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

  // POST /api/assignments/auto-match - Auto-match reviewers (excludes conflicts)
  static async autoMatchReviewers(req, res) {
    try {
      // Validate input
      const validator = vine.compile(autoMatchSchema);
      const payload = await validator.validate(req.body);
      const { item_id, item_type } = payload;

      // Load item + context
      const ctx = await getItemContext(prisma, String(item_type), parseInt(item_id, 10));
      if (!ctx) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }

      const item =
        item_type === "paper"
          ? ctx.raw
          : ctx.raw; // already loaded by getItemContext

      const itemDomainId = ctx.domain_id || 0;
      const teamUserSet = new Set(ctx.team_user_ids || []);

      // Fetch ACTIVE reviewers with domain expertise; exclude submitting teacher here
      const availableReviewersRaw = await prisma.reviewer.findMany({
        where: {
          status: "ACTIVE",
          teacher_id: { not: item.teacher_id }, // exclude author teacher
          teacher: {
            user: {
              userdomain: {
                some: { domain_id: itemDomainId },
              },
            },
          },
        },
        include: {
          teacher: {
            include: {
              user: {
                include: {
                  userdomain: {
                    include: {
                      domain: { select: { domain_id: true, domain_name: true } },
                    },
                  },
                },
              },
              department: true,
            },
          },
          reviewerassignment: {
            where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
          },
        },
      });

      // Exclude any reviewer whose underlying user_id is a team member/author
      const availableReviewers = availableReviewersRaw.filter((rev) => {
        const uid =
          Number(rev.teacher?.user?.user_id) ||
          Number(rev.teacher?.user_id) ||
          null;
        if (uid && teamUserSet.has(uid)) return false;
        return true;
      });

      // Score by domain expertise (already guaranteed) + workload (lower is better)
      const reviewersWithScore = availableReviewers.map((reviewer) => {
        const currentWorkload = reviewer.reviewerassignment?.length || 0;
        const maxWorkload = 5;
        const workloadScore = Math.max(0, (maxWorkload - currentWorkload) / maxWorkload);

        // Domain score is 1.0 (they match); keep formula for extensibility
        const domainScore = 1.0;

        const totalScore = domainScore * 0.7 + workloadScore * 0.3;

        return {
          ...reviewer,
          score: totalScore,
          workload: currentWorkload,
          expertise:
            reviewer.teacher?.user?.userdomain?.map(
              (ud) => ud.domain.domain_name
            ) || [],
        };
      });

      // Pick top N (3)
      const recommendedReviewers = reviewersWithScore
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((reviewer) => ({
          id: reviewer.reviewer_id,
          name: reviewer.teacher?.user?.name || "Unknown",
          email: reviewer.teacher?.user?.email || "Unknown",
          department: reviewer.teacher?.department?.department_name || "Unknown",
          workload: reviewer.workload,
          score: reviewer.score,
          hasExpertise: true,
          expertise: reviewer.expertise,
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
        item_id,
        item_type,
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