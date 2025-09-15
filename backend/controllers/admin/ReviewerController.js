import prisma from "../../DB/db.config.js";
import { Vine, errors } from "@vinejs/vine";
import { emailQueue, emailQueueName } from "../../jobs/SendEmailJob.js";
import logger from "../../config/logger.js";
import {
  inviteReviewersSchema,
  // addReviewerSchema,
  updateReviewerStatusSchema
} from "../../validations/admin/reviewerValidation.js";

const vine = new Vine();

class ReviewerController {
  // GET /api/reviewers
  static async index(req, res) {
    try {
      const reviewers = await prisma.reviewer.findMany({
        include: {
          teacher: {
            include: {
              user: { select: { name: true, email: true } },
              department: { select: { department_name: true } },
            },
          },
          _count: { select: { review: true, reviewerassignment: true } },
        },
      });

      const reviewersWithStats = await Promise.all(
        reviewers.map(async (reviewer) => {
          try {
            const completedReviews = await prisma.review.count({
              where: { reviewer_id: reviewer.reviewer_id, decision: { not: null } },
            });

            let avgReviewTime = null;
            try {
              const reviewTimes = await prisma.review.findMany({
                where: {
                  reviewer_id: reviewer.reviewer_id,
                  decision: { not: null },
                  reviewed_at: { not: null },
                },
                include: {
                  paper: { select: { created_at: true } },
                  proposal: { select: { created_at: true } },
                },
              });

              if (reviewTimes.length > 0) {
                const valid = reviewTimes.filter((r) => {
                  const submittedAt = r.paper?.created_at || r.proposal?.created_at;
                  return submittedAt && r.reviewed_at;
                });
                if (valid.length > 0) {
                  const totalDays = valid.reduce((sum, r) => {
                    const submittedAt = r.paper?.created_at || r.proposal?.created_at;
                    const days = Math.ceil((new Date(r.reviewed_at) - new Date(submittedAt)) / (1000 * 60 * 60 * 24));
                    return sum + Math.max(0, days);
                  }, 0);
                  avgReviewTime = Math.round(totalDays / valid.length);
                }
              }
            } catch (e) {
              logger.error(`Error calculating review time for reviewer ${reviewer.reviewer_id}:`, e);
            }

            let expertise = [];
            try {
              if (reviewer.teacher?.user_id) {
                const userDomains = await prisma.userdomain.findMany({
                  where: { user_id: reviewer.teacher.user_id },
                  include: { domain: { select: { domain_name: true } } },
                });
                expertise = userDomains.map((ud) => ud.domain?.domain_name || "Unknown").filter(Boolean);
              }
            } catch (e) {
              logger.error(`Error fetching domains for reviewer ${reviewer.reviewer_id}:`, e);
            }

            const assignmentCount = reviewer._count?.reviewerassignment || 0;
            const workloadPercentage = Math.min((assignmentCount / 5) * 100, 100);

            return {
              id: reviewer.reviewer_id,
              teacherId: reviewer.teacher_id, // <-- ADDED for frontend email action
              name: reviewer.teacher?.user?.name || "N/A",
              email: reviewer.teacher?.user?.email || "N/A",
              department: reviewer.teacher?.department?.department_name || "N/A",
              designation: reviewer.teacher?.designation || "N/A",
              expertise,
              assigned: assignmentCount,
              completed: completedReviews,
              workload: Math.round(workloadPercentage),
              avgTime: avgReviewTime,
              status: reviewer.status || "PENDING",
            };
          } catch (err) {
            logger.error(`Error processing reviewer ${reviewer.reviewer_id}:`, err);
            return {
              id: reviewer.reviewer_id,
              teacherId: reviewer.teacher_id,
              name: reviewer.teacher?.user?.name || "N/A",
              email: reviewer.teacher?.user?.email || "N/A",
              department: reviewer.teacher?.department?.department_name || "N/A",
              designation: reviewer.teacher?.designation || "N/A",
              expertise: [],
              assigned: 0,
              completed: 0,
              workload: 0,
              avgTime: null,
              status: reviewer.status || "PENDING",
            };
          }
        })
      );

      const totalReviewers = reviewers.length;
      const activeReviewers = reviewers.filter((r) => r.status === "ACTIVE").length;
      const totalCompletedReviews = reviewersWithStats.reduce((s, r) => s + (r.completed || 0), 0);
      const totalAssignedReviews = reviewersWithStats.reduce((s, r) => s + (r.assigned || 0), 0);
      const completionRate = totalAssignedReviews > 0 ? Math.round((totalCompletedReviews / totalAssignedReviews) * 100) : 0;
      const times = reviewersWithStats.filter((r) => r.avgTime !== null && r.avgTime > 0);
      const avgReviewTime = times.length > 0 ? Math.round(times.reduce((s, r) => s + r.avgTime, 0) / times.length) : null;

      return res.json({
        reviewers: reviewersWithStats,
        stats: { totalReviewers, activeReviewers, completedReviews: totalCompletedReviews, completionRate, avgReviewTime },
      });
    } catch (error) {
      logger.error("Reviewers fetch error:", error);
      const isDevelopment = process.env.NODE_ENV === "development";
      return res.status(500).json({
        error: "Failed to fetch reviewers data",
        ...(isDevelopment && { details: error.message, stack: error.stack }),
      });
    }
  }

  // GET /api/reviewers/potential - Get potential reviewers (teachers not yet reviewers)
  static async getPotentialReviewers(req, res) {
    try {
      // Get all teachers who are not reviewers yet
      const potentialReviewers = await prisma.teacher.findMany({
        where: {
          isReviewer: false,
          user: {
            isVerified: true,
            role: 'TEACHER'
          }
        },
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
              email: true
            }
          },
          department: {
            select: {
              department_name: true
            }
          }
        }
      });

      // Get user domains for each potential reviewer
      const potentialWithDomains = await Promise.all(
        potentialReviewers.map(async (teacher) => {
          try {
            const userDomains = await prisma.userdomain.findMany({
              where: { user_id: teacher.user_id },
              include: {
                domain: {
                  select: {
                    domain_id: true,
                    domain_name: true
                  }
                }
              }
            });

            return {
              id: teacher.teacher_id,
              user_id: teacher.user_id,
              name: teacher.user?.name || 'N/A',
              email: teacher.user?.email || 'N/A',
              department: teacher.department?.department_name || 'N/A',
              designation: teacher.designation || 'N/A',
              domains: userDomains.map(ud => ({
                id: ud.domain?.domain_id,
                name: ud.domain?.domain_name || 'Unknown'
              })).filter(domain => domain.id)
            };
          } catch (teacherError) {
            logger.error(`Error processing teacher ${teacher.teacher_id}:`, teacherError);
            return {
              id: teacher.teacher_id,
              user_id: teacher.user_id,
              name: teacher.user?.name || 'N/A',
              email: teacher.user?.email || 'N/A',
              department: teacher.department?.department_name || 'N/A',
              designation: teacher.designation || 'N/A',
              domains: []
            };
          }
        })
      );

      return res.json(potentialWithDomains);

    } catch (error) {
      console.error("Error fetching potential reviewers:", error);
      logger.error("Potential reviewers fetch error:", error);

      const isDevelopment = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Failed to fetch potential reviewers",
        ...(isDevelopment && { details: error.message })
      });
    }
  }

  // POST /api/reviewers/invite - Send invitations AND upsert reviewer rows
  // POST /api/reviewers/invite (single path: invite + upsert reviewer row)
  static async sendInvitations(req, res) {
    try {
      const validator = vine.compile(inviteReviewersSchema);
      const payload = await validator.validate(req.body);

      const teacherIds = Array.isArray(payload.reviewer_ids)
        ? [...new Set(payload.reviewer_ids.map((id) => parseInt(id, 10)).filter((n) => Number.isInteger(n)))]
        : [];

      if (teacherIds.length === 0) {
        return res.status(400).json({ error: "reviewer_ids must be a non-empty array of integers" });
      }

      const teachers = await prisma.teacher.findMany({
        where: { teacher_id: { in: teacherIds } },
        include: { user: { select: { name: true, email: true, isVerified: true } } },
      });

      if (teachers.length === 0) {
        return res.status(404).json({ error: "No valid teachers found for the provided IDs" });
      }

      let createdCount = 0;
      await prisma.$transaction(async (tx) => {
        for (const t of teachers) {
          await tx.teacher.update({ where: { teacher_id: t.teacher_id }, data: { isReviewer: true } });

          const existing = await tx.reviewer.findUnique({ where: { teacher_id: t.teacher_id } });
          if (!existing) {
            await tx.reviewer.create({ data: { teacher_id: t.teacher_id, status: "PENDING" } });
            createdCount++;
          }
        }
      });

      const emailJobs = teachers
        .filter((t) => t.user?.email)
        .map((t) => ({
          toEmail: t.user.email,
          subject: "Invitation to Join Review Committee",
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Review Committee Invitation</h2>
              <p>Dear ${t.user.name || "Professor"},</p>
              <p>You have been invited to join our review committee. Your expertise would be valuable in reviewing academic papers and proposals in your field.</p>
              ${
                payload.custom_message
                  ? `
              <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <p style="margin: 0;"><strong>Personal Message:</strong></p>
                <p style="margin: 5px 0 0 0;">${payload.custom_message}</p>
              </div>
              `
                  : ""
              }
              <p>To accept this invitation and join the review committee, please log in to your account and contact the administrator.</p>
              <div style="margin: 30px 0;">
                <a href="${process.env.UI_URL || "http://localhost:5173"}/login"
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Login to Your Account
                </a>
              </div>
              <p>Best regards,<br/>The Review Committee Team</p>
            </div>
          `,
        }));

      try {
        if (emailJobs.length > 0) {
          await emailQueue.add(emailQueueName, emailJobs);
        }
      } catch (emailError) {
        logger.error("Error adding emails to queue:", emailError);
      }

      return res.json({
        message: `Invitations sent to ${emailJobs.length} teacher(s). ${createdCount} new reviewer record(s) created.`,
        invitedCount: emailJobs.length,
        createdCount,
      });
    } catch (error) {
      logger.error("Reviewer invitations error:", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      }
      const isDevelopment = process.env.NODE_ENV === "development";
      return res.status(500).json({
        error: "Failed to send invitations",
        ...(isDevelopment && { details: error.message }),
      });
    }
  }
  // PUT /api/reviewers/:id - Update reviewer status
  static async update(req, res) {
    try {
      const reviewerId = parseInt(req.params.id);

      if (isNaN(reviewerId)) {
        return res.status(400).json({
          error: "Invalid reviewer ID"
        });
      }

      const validator = vine.compile(updateReviewerStatusSchema);
      const payload = await validator.validate(req.body);

      // Check if reviewer exists
      const reviewer = await prisma.reviewer.findUnique({
        where: { reviewer_id: reviewerId },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });

      if (!reviewer) {
        return res.status(404).json({
          error: "Reviewer not found"
        });
      }

      // Update reviewer status
      const updatedReviewer = await prisma.reviewer.update({
        where: { reviewer_id: reviewerId },
        data: {
          status: payload.status
        }
      });

      // Send notification email about status change if email is available and status changed
      if (payload.status !== reviewer.status && reviewer.teacher?.user?.email) {
        const statusMessages = {
          'ACTIVE': 'Your reviewer account has been activated.',
          'INACTIVE': 'Your reviewer account has been set to inactive.',
          'SUSPENDED': 'Your reviewer account has been suspended.',
          'PENDING': 'Your reviewer account status is pending review.'
        };

        const statusEmail = {
          toEmail: reviewer.teacher.user.email,
          subject: `Reviewer Status Update - ${payload.status}`,
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Reviewer Status Update</h2>
              
              <p>Dear ${reviewer.teacher.user.name || 'Reviewer'},</p>
              
              <p>${statusMessages[payload.status] || 'Your reviewer status has been updated.'}</p>
              
              <p><strong>New Status:</strong> ${payload.status}</p>
              
              <p>If you have any questions about this change, please contact the administration team.</p>
              
              <p>Best regards,<br>The Review Committee Team</p>
            </div>
          `
        };

        try {
          await emailQueue.add(emailQueueName, [statusEmail]);
        } catch (emailError) {
          logger.error("Error sending status update email:", emailError);
        }
      }

      logger.info(`Reviewer ${reviewerId} status updated to ${payload.status}`);

      return res.json({
        message: "Reviewer status updated successfully",
        reviewer: {
          id: updatedReviewer.reviewer_id,
          status: updatedReviewer.status
        }
      });

    } catch (error) {
      console.error("Error updating reviewer:", error);
      logger.error("Update reviewer error:", error);

      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages
        });
      }

      const isDevelopment = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Failed to update reviewer status",
        ...(isDevelopment && { details: error.message })
      });
    }
  }

  // DELETE /api/reviewers/:id - Remove reviewer
  static async removeReviewer(req, res) {
    try {
      const reviewerId = parseInt(req.params.id);

      if (isNaN(reviewerId)) {
        return res.status(400).json({
          error: "Invalid reviewer ID"
        });
      }

      // Check if reviewer exists and get related info
      const reviewer = await prisma.reviewer.findUnique({
        where: { reviewer_id: reviewerId },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              review: true,
              reviewerassignment: true
            }
          }
        }
      });

      if (!reviewer) {
        return res.status(404).json({
          error: "Reviewer not found"
        });
      }

      // Check if reviewer has pending assignments
      if (reviewer._count?.reviewerassignment > 0) {
        return res.status(400).json({
          error: "Cannot remove reviewer with pending assignments. Please reassign reviews first."
        });
      }

      // Use transaction to remove reviewer
      await prisma.$transaction(async (tx) => {
        // Remove reviewer record
        await tx.reviewer.delete({
          where: { reviewer_id: reviewerId }
        });

        // Update teacher isReviewer flag
        if (reviewer.teacher_id) {
          await tx.teacher.update({
            where: { teacher_id: reviewer.teacher_id },
            data: { isReviewer: false }
          });
        }
      });

      // Send notification email if email is available
      if (reviewer.teacher?.user?.email) {
        const removalEmail = {
          toEmail: reviewer.teacher.user.email,
          subject: "Review Committee Status Update",
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Review Committee Status Update</h2>
              
              <p>Dear ${reviewer.teacher.user.name || 'Professor'},</p>
              
              <p>You have been removed from the review committee. Your reviewer access has been revoked.</p>
              
              <p>If you believe this was done in error or have questions, please contact the administration team.</p>
              
              <p>Thank you for your past contributions to the review process.</p>
              
              <p>Best regards,<br>The Review Committee Team</p>
            </div>
          `
        };

        try {
          await emailQueue.add(emailQueueName, [removalEmail]);
        } catch (emailError) {
          logger.error("Error sending removal email:", emailError);
        }
      }

      logger.info(`Reviewer removed: ${reviewer.teacher?.user?.name} (ID: ${reviewerId})`);

      return res.json({
        message: "Reviewer removed successfully"
      });

    } catch (error) {
      console.error("Error removing reviewer:", error);
      logger.error("Remove reviewer error:", error);

      const isDevelopment = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Failed to remove reviewer",
        ...(isDevelopment && { details: error.message })
      });
    }
  }

  // GET /api/reviewers/:id/workload - Get detailed workload for a reviewer
  static async getWorkloadDetails(req, res) {
    try {
      const reviewerId = parseInt(req.params.id);

      if (isNaN(reviewerId)) {
        return res.status(400).json({
          error: "Invalid reviewer ID"
        });
      }

      const reviewer = await prisma.reviewer.findUnique({
        where: { reviewer_id: reviewerId },
        include: {
          teacher: {
            include: {
              user: { select: { name: true } }
            }
          },
          reviewerassignment: {
            include: {
              paper: {
                select: {
                  paper_id: true,
                  title: true,
                  created_at: true,
                  status: true
                }
              },
              proposal: {
                select: {
                  proposal_id: true,
                  title: true,
                  created_at: true,
                  status: true
                }
              }
            }
          },
          review: {
            where: {
              reviewed_at: { not: null }
            },
            include: {
              paper: { select: { title: true } },
              proposal: { select: { title: true } }
            },
            orderBy: { reviewed_at: 'desc' }
          }
        }
      });

      if (!reviewer) {
        return res.status(404).json({
          error: "Reviewer not found"
        });
      }

      const assignments = reviewer.reviewerassignment || [];
      const reviews = reviewer.review || [];

      const workloadDetails = {
        reviewer: {
          id: reviewer.reviewer_id,
          name: reviewer.teacher?.user?.name || 'N/A',
          status: reviewer.status || 'PENDING'
        },
        assignments: {
          total: assignments.length,
          papers: assignments.filter(a => a.paper_id).length,
          proposals: assignments.filter(a => a.proposal_id).length,
          details: assignments.map(assignment => ({
            id: assignment.assignment_id,
            type: assignment.paper_id ? 'paper' : 'proposal',
            title: assignment.paper?.title || assignment.proposal?.title || 'Untitled',
            submitted_at: assignment.paper?.created_at || assignment.proposal?.created_at,
            status: assignment.paper?.status || assignment.proposal?.status
          }))
        },
        completed_reviews: {
          total: reviews.length,
          recent: reviews.slice(0, 5).map(review => ({
            id: review.review_id,
            title: review.paper?.title || review.proposal?.title || 'Untitled',
            decision: review.decision,
            reviewed_at: review.reviewed_at,
            score: review.score
          }))
        }
      };

      return res.json(workloadDetails);

    } catch (error) {
      console.error("Error fetching workload details:", error);
      logger.error("Workload details error:", error);

      const isDevelopment = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Failed to fetch workload details",
        ...(isDevelopment && { details: error.message })
      });
    }
  }
}

export default ReviewerController;

