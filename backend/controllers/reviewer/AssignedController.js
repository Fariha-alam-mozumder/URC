// controllers/reviewer/AssignedController.js
import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";
import { finalizeIfCompleted } from "../../utils/finalizeIfCompleted.js";


async function resolveReviewerId(req) {
  try {
    const u = req.user || {};

    if (u.reviewer_id) return u.reviewer_id;
    if (u.reviewerId) return u.reviewerId;

    if (u.teacher_id) {
      const rv = await prisma.reviewer.findUnique({
        where: { teacher_id: u.teacher_id },
        select: { reviewer_id: true },
      });
      if (rv) return rv.reviewer_id;
    }
    if (u.teacherId) {
      const rv = await prisma.reviewer.findUnique({
        where: { teacher_id: u.teacherId },
        select: { reviewer_id: true },
      });
      if (rv) return rv.reviewer_id;
    }

    const userId = u.user_id ?? u.id ?? u.userId;
    if (userId) {
      const teacher = await prisma.teacher.findFirst({
        where: { user_id: userId },
        select: { teacher_id: true },
      });
      if (teacher) {
        const rv = await prisma.reviewer.findUnique({
          where: { teacher_id: teacher.teacher_id },
          select: { reviewer_id: true },
        });
        if (rv) return rv.reviewer_id;
      }
    }

    return null;
  } catch (err) {
    logger.error("resolveReviewerId error:", err);
    return null;
  }
}

function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "10", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

class ReviewerAssignedController {
 
  static async getAssignedPapers(req, res) {
    try {
      const reviewer_id = await resolveReviewerId(req);
      if (!reviewer_id) {
        return res.status(403).json({ success: false, message: "Unable to resolve reviewer identity." });
      }

      const { page, limit, skip } = parsePagination(req.query);
      const statusFilter = req.query.status;

      const where = {
        reviewer_id,
        paper_id: { not: null },
        ...(statusFilter ? { status: statusFilter } : {}),
      };

      const [total, assignments] = await Promise.all([
        prisma.reviewerassignment.count({ where }),
        prisma.reviewerassignment.findMany({
          where,
          include: {
            paper: {
              include: {
                teacher: {
                  include: {
                    user: { select: { name: true, email: true } },
                    department: { select: { department_name: true } },
                  },
                },
                team: {
                  include: {
                    domain: { select: { domain_name: true } },
                    teammember: {
                      include: {
                        user: { select: { user_id: true, name: true, email: true } }
                      }
                    }
                  }
                },
              },
            },
          },
          orderBy: { assigned_date: "desc" },
          skip,
          take: limit,
        }),
      ]);

      const data = assignments.map((a) => {
        const p = a.paper;
        const dueDate = a.due_date ? new Date(a.due_date) : null;

        // Get all team members' info (following the pattern from AssignmentController.js)
        const members = p?.team?.teammember ?? [];

        // Remove duplicates by user_id and create structured author list
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

        // Create display string for backward compatibility
        const authorsDisplay = authors.length > 0
          ? authors.map(a => a.name).join(', ')
          : (p?.teacher?.user?.name || 'Unknown');

        return {
          assignmentId: a.assignment_id,
          id: p ? `RP-${String(p.paper_id).padStart(3, "0")}` : null,
          paperId: p?.paper_id ?? null,
          title: p?.title ?? "Untitled",
          authors: authorsDisplay, 
          author: authorsDisplay, 
          teamMembers: authors, 
          submittedBy: p?.teacher?.user?.email ?? null,
          pdf_path: p?.pdf_path ?? null,
          file_size: p?.file_size ?? null,
          track: p?.team?.domain?.domain_name ?? null,
          team_name: p?.team?.team_name ?? null,
          domain_name: p?.team?.domain?.domain_name ?? null,
          assignmentStatus: a.status ?? null,
          assignedDate: a.assigned_date ? a.assigned_date.toISOString() : null,
          due: dueDate ? dueDate.toISOString() : null,
        };
      });

      return res.status(200).json({
        success: true,
        data,
        pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
      });
    } catch (error) {
      logger.error("Error getAssignedPapers:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  
  static async getAssignedProposals(req, res) {
    try {
      const reviewer_id = await resolveReviewerId(req);
      if (!reviewer_id) {
        return res.status(403).json({ success: false, message: "Unable to resolve reviewer identity." });
      }

      const { page, limit, skip } = parsePagination(req.query);
      const statusFilter = req.query.status;

      const where = {
        reviewer_id,
        proposal_id: { not: null },
        ...(statusFilter ? { status: statusFilter } : {}),
      };

      const [total, assignments] = await Promise.all([
        prisma.reviewerassignment.count({ where }),
        prisma.reviewerassignment.findMany({
          where,
          include: {
            proposal: {
              include: {
                teacher: {
                  include: {
                    user: { select: { name: true, email: true } },
                    department: { select: { department_name: true } },
                  },
                },
                team: {
                  include: {
                    domain: { select: { domain_name: true } },
                    teammember: {
                      include: {
                        user: { select: { user_id: true, name: true, email: true } }
                      }
                    }
                  }
                },
              },
            },
          },
          orderBy: { assigned_date: "desc" },
          skip,
          take: limit,
        }),
      ]);

      const data = assignments.map((a) => {
        const pr = a.proposal;
        const dueDate = a.due_date ? new Date(a.due_date) : null;

        // Get all team members' info (following the pattern from AssignmentController.js)
        const members = pr?.team?.teammember ?? [];

        // Remove duplicates by user_id and create structured author list
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

        // Create display string for backward compatibility
        const authorsDisplay = authors.length > 0
          ? authors.map(a => a.name).join(', ')
          : (pr?.teacher?.user?.name || 'Unknown');

        return {
          assignmentId: a.assignment_id,
          id: pr ? `PR-${String(pr.proposal_id).padStart(3, "0")}` : null,
          proposalId: pr?.proposal_id ?? null,
          title: pr?.title ?? "Untitled",
          authors: authorsDisplay, 
          author: authorsDisplay, 
          teamMembers: authors, 
          submittedBy: pr?.teacher?.user?.email ?? null,
          pdf_path: pr?.pdf_path ?? null,
          file_size: pr?.file_size ?? null,
          track: pr?.team?.domain?.domain_name ?? null,
          team_name: pr?.team?.team_name ?? null,
          domain_name: pr?.team?.domain?.domain_name ?? null,
          assignmentStatus: a.status ?? null,
          assignedDate: a.assigned_date ? a.assigned_date.toISOString() : null,
          due: dueDate ? dueDate.toISOString() : null,
        };
      });

      return res.status(200).json({
        success: true,
        data,
        pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
      });
    } catch (error) {
      logger.error("Error getAssignedProposals:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }

  
  static async updateAssignmentStatus(req, res) {
    try {
      const reviewer_id = await resolveReviewerId(req);
      if (!reviewer_id) {
        return res.status(403).json({ success: false, message: "Unable to resolve reviewer identity." });
      }

      const assignmentId = parseInt(req.params.id, 10);
      if (Number.isNaN(assignmentId)) {
        return res.status(400).json({ success: false, message: "Invalid assignment id" });
      }

      const { status: newStatus } = req.body;
      const allowedStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"];
      if (!newStatus || !allowedStatuses.includes(newStatus)) {
        return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}` });
      }

      // pull current assignment including timestamps & linkage
      const assignment = await prisma.reviewerassignment.findUnique({
        where: { assignment_id: assignmentId },
        select: {
          assignment_id: true,
          reviewer_id: true,
          status: true,
          started_at: true,
          completed_at: true,
          due_date: true,
          paper_id: true,
          proposal_id: true,
        },
      });

      if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
      if (assignment.reviewer_id !== reviewer_id) return res.status(403).json({ success: false, message: "Not authorized" });

      // Prevent changing from COMPLETED back to other states
      if (assignment.status === "COMPLETED" && newStatus !== "COMPLETED") {
        return res.status(400).json({ success: false, message: "Cannot change status after COMPLETED" });
      }

      // Optional safety: block manual COMPLETED if no review exists yet
      if (newStatus === "COMPLETED") {
        const hasReview = await prisma.review.findFirst({
          where: assignment.paper_id
            ? { reviewer_id, paper_id: assignment.paper_id }
            : { reviewer_id, proposal_id: assignment.proposal_id },
          select: { review_id: true },
        });
        if (!hasReview) {
          return res.status(400).json({
            success: false,
            message: "You must submit a review before marking as COMPLETED.",
          });
        }
      }

      // Prepare patch with timestamps
      const now = new Date();
      const data = { status: newStatus };
      if (newStatus === "IN_PROGRESS" && !assignment.started_at) data.started_at = now;
      if (newStatus === "COMPLETED") data.completed_at = now;

      const updated = await prisma.reviewerassignment.update({
        where: { assignment_id: assignmentId },
        data,
      });

      // Try to finalize the parent item (paper/proposal) per the admin rules
      if (assignment.paper_id) await finalizeIfCompleted("paper", assignment.paper_id);
      if (assignment.proposal_id) await finalizeIfCompleted("proposal", assignment.proposal_id);

      // Return brief info
      const full = await prisma.reviewerassignment.findUnique({
        where: { assignment_id: assignmentId },
        include: {
          paper: { select: { paper_id: true, title: true, pdf_path: true } },
          proposal: { select: { proposal_id: true, title: true, pdf_path: true } },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Assignment status updated",
        assignment: {
          assignmentId: full.assignment_id,
          reviewerId: full.reviewer_id,
          paperId: full.paper?.paper_id ?? null,
          proposalId: full.proposal?.proposal_id ?? null,
          status: updated.status,
          started_at: updated.started_at ?? null,
          completed_at: updated.completed_at ?? null,
        },
      });
    } catch (error) {
      logger.error("Error updateAssignmentStatus:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default ReviewerAssignedController;