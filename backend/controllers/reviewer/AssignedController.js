// controllers/reviewer/AssignedController.js
import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";

/**
 * Resolve reviewer id from various possible req.user shapes.
 * Tries common fields: reviewer_id, reviewerId, teacher_id, teacherId, user_id, id
 */
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
  /**
   * GET /api/reviewer/assigned-papers
   * Query params: page, limit, status
   * Returns { success: true, data: [...], pagination: { page, limit, total, pages } }
   */
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
          // Friendly display id used by frontend
          id: p ? `RP-${String(p.paper_id).padStart(3, "0")}` : null,
          paperId: p?.paper_id ?? null,
          title: p?.title ?? "Untitled",
          authors: authorsDisplay, // Updated to show all team members
          author: authorsDisplay, // Alternative field name for compatibility
          teamMembers: authors, // Structured list with names and emails
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

  /**
   * GET /api/reviewer/assigned-proposals
   * Query params: page, limit, status
   * Returns same shape as papers (but with proposal fields)
   */
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
          authors: authorsDisplay, // Updated to show all team members
          author: authorsDisplay, // Alternative field name for compatibility
          teamMembers: authors, // Structured list with names and emails
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

  /**
   * PATCH /api/reviewer/assignments/:id/status
   * Body: { status: "IN_PROGRESS" | "COMPLETED" | "PENDING" | "OVERDUE" }
   * - Validates ownership and allowed transitions
   */
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

      const { status } = req.body;
      const allowedStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"];
      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}` });
      }

      const assignment = await prisma.reviewerassignment.findUnique({
        where: { assignment_id: assignmentId },
        select: { assignment_id: true, reviewer_id: true, status: true, paper_id: true, proposal_id: true },
      });

      if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });
      if (assignment.reviewer_id !== reviewer_id) return res.status(403).json({ success: false, message: "Not authorized" });

      // Prevent changing from COMPLETED back to other states
      if (assignment.status === "COMPLETED" && status !== "COMPLETED") {
        return res.status(400).json({ success: false, message: "Cannot change status after COMPLETED" });
      }

      const updated = await prisma.reviewerassignment.update({
        where: { assignment_id: assignmentId },
        data: { status },
      });

      // Fetch brief info to return
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
        },
      });
    } catch (error) {
      logger.error("Error updateAssignmentStatus:", error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  }
}

export default ReviewerAssignedController;