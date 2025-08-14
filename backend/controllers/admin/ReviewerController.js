import prisma from "../../DB/db.config.js";
import { Vine, errors } from "@vinejs/vine";
import { emailQueue, emailQueueName } from "../../jobs/SendEmailJob.js";
import logger from "../../config/logger.js";
import {
  inviteReviewersSchema,
  addReviewerSchema,
  updateReviewerStatusSchema
} from "../../validations/admin/reviewerValidation.js";

const vine = new Vine();

class ReviewerController {
  // GET /api/reviewers - Fetch all reviewers with stats
  static async index(req, res) {
    try {
      console.log("ReviewerController.index called");

      // Fetch all reviewers with related data
      const reviewers = await prisma.reviewer.findMany({
        include: {
          teacher: {
            include: {
              user: {
                select: {
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
          },
          reviewerpreference: {
            include: {
              domain: {
                select: {
                  domain_name: true
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

      // Calculate stats for each reviewer
      const reviewersWithStats = await Promise.all(
        reviewers.map(async (reviewer) => {
          try {
            // Get completed reviews count
            const completedReviews = await prisma.review.count({
              where: {
                reviewer_id: reviewer.reviewer_id,
                decision: { not: null }
              }
            });

            // Get average review time (in days) with better error handling
            let avgReviewTime = null;
            try {
              const reviewTimes = await prisma.review.findMany({
                where: {
                  reviewer_id: reviewer.reviewer_id,
                  decision: { not: null },
                  reviewed_at: { not: null } // Ensure reviewed_at is not null
                },
                include: {
                  paper: { select: { created_at: true } },
                  proposal: { select: { created_at: true } }
                }
              });

              if (reviewTimes.length > 0) {
                const validReviewTimes = reviewTimes.filter(review => {
                  const submittedAt = review.paper?.created_at || review.proposal?.created_at;
                  return submittedAt && review.reviewed_at;
                });

                if (validReviewTimes.length > 0) {
                  const totalDays = validReviewTimes.reduce((sum, review) => {
                    const submittedAt = review.paper?.created_at || review.proposal?.created_at;
                    const days = Math.ceil(
                      (new Date(review.reviewed_at) - new Date(submittedAt)) / (1000 * 60 * 60 * 24)
                    );
                    return sum + Math.max(0, days); // Ensure no negative days
                  }, 0);
                  avgReviewTime = Math.round(totalDays / validReviewTimes.length);
                }
              }
            } catch (timeError) {
              logger.error(`Error calculating review time for reviewer ${reviewer.reviewer_id}:`, timeError);
              avgReviewTime = null;
            }

            // Calculate workload percentage (assuming max 5 assignments)
            const assignmentCount = reviewer._count?.reviewerassignment || 0;
            const workloadPercentage = Math.min((assignmentCount / 5) * 100, 100);

            return {
              id: reviewer.reviewer_id,
              name: reviewer.teacher?.user?.name || 'N/A',
              email: reviewer.teacher?.user?.email || 'N/A',
              department: reviewer.teacher?.department?.department_name || 'N/A',
              designation: reviewer.teacher?.designation || 'N/A',
              expertise: (reviewer.reviewerpreference || []).map(pref => 
                pref.domain?.domain_name || 'Unknown'
              ),
              assigned: assignmentCount,
              completed: completedReviews,
              workload: Math.round(workloadPercentage),
              avgTime: avgReviewTime,
              status: reviewer.status || 'PENDING'
            };
          } catch (reviewerError) {
            logger.error(`Error processing reviewer ${reviewer.reviewer_id}:`, reviewerError);
            // Return a basic reviewer object if processing fails
            return {
              id: reviewer.reviewer_id,
              name: reviewer.teacher?.user?.name || 'N/A',
              email: reviewer.teacher?.user?.email || 'N/A',
              department: reviewer.teacher?.department?.department_name || 'N/A',
              designation: reviewer.teacher?.designation || 'N/A',
              expertise: [],
              assigned: 0,
              completed: 0,
              workload: 0,
              avgTime: null,
              status: reviewer.status || 'PENDING'
            };
          }
        })
      );

      // Calculate overall stats with error handling
      const totalReviewers = reviewers.length;
      const activeReviewers = reviewers.filter(r => r.status === 'ACTIVE').length;
      const totalCompletedReviews = reviewersWithStats.reduce((sum, r) => sum + (r.completed || 0), 0);
      const totalAssignedReviews = reviewersWithStats.reduce((sum, r) => sum + (r.assigned || 0), 0);
      const completionRate = totalAssignedReviews > 0 
        ? Math.round((totalCompletedReviews / totalAssignedReviews) * 100) 
        : 0;
      
      const reviewTimesWithData = reviewersWithStats.filter(r => r.avgTime !== null && r.avgTime > 0);
      const avgReviewTime = reviewTimesWithData.length > 0
        ? Math.round(reviewTimesWithData.reduce((sum, r) => sum + r.avgTime, 0) / reviewTimesWithData.length)
        : null;

      const stats = {
        totalReviewers,
        activeReviewers,
        completedReviews: totalCompletedReviews,
        completionRate,
        avgReviewTime
      };

      return res.json({
        reviewers: reviewersWithStats,
        stats
      });

    } catch (error) {
      console.error("Error fetching reviewers:", error);
      logger.error("Reviewers fetch error:", error);
      
      // Return more detailed error information in development
      const isDevelopment = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Failed to fetch reviewers data",
        ...(isDevelopment && { details: error.message, stack: error.stack })
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
              })).filter(domain => domain.id) // Filter out invalid domains
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

  // POST /api/reviewers/invite - Send invitations to potential reviewers
  static async sendInvitations(req, res) {
    try {

        logger.info("inviteReviewers called");
    logger.info("Request body: ", req.body);

      const validator = vine.compile(inviteReviewersSchema);
      const payload = await validator.validate(req.body);

      // Validate reviewer_ids array
      if (!payload.reviewer_ids || !Array.isArray(payload.reviewer_ids) || payload.reviewer_ids.length === 0) {
        return res.status(400).json({
          error: "reviewer_ids must be a non-empty array"
        });
      }

      // Get teacher details for the selected IDs
      const teachers = await prisma.teacher.findMany({
        where: {
          teacher_id: { in: payload.reviewer_ids }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      if (teachers.length === 0) {
        return res.status(404).json({
          error: "No valid teachers found for the provided IDs"
        });
      }

      // Prepare email jobs with error handling
      const emailJobs = teachers
        .filter(teacher => teacher.user?.email) // Only include teachers with valid emails
        .map(teacher => ({
          toEmail: teacher.user.email,
          subject: "Invitation to Join Review Committee",
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Review Committee Invitation</h2>
              
              <p>Dear ${teacher.user.name || 'Professor'},</p>
              
              <p>You have been invited to join our review committee. Your expertise would be valuable in reviewing academic papers and proposals in your field.</p>
              
              ${payload.custom_message ? `
              <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <p style="margin: 0;"><strong>Personal Message:</strong></p>
                <p style="margin: 5px 0 0 0;">${payload.custom_message}</p>
              </div>
              ` : ''}
              
              <p>To accept this invitation and join the review committee, please log into your account and contact the administrator.</p>
              
              <div style="margin: 30px 0;">
                <a href="${process.env.UI_URL || 'http://localhost:5173'}/login" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Login to Your Account
                </a>
              </div>
              
              <p>Thank you for considering this opportunity to contribute to academic excellence.</p>
              
              <p>Best regards,<br>The Review Committee Team</p>
            </div>
          `
        }));

      if (emailJobs.length === 0) {
        return res.status(400).json({
          error: "No valid email addresses found for the selected teachers"
        });
      }

      // Send emails via queue
      try {
        await emailQueue.add(emailQueueName, emailJobs);
      } catch (emailError) {
        logger.error("Error adding emails to queue:", emailError);
        // Continue execution - emails might still be sent
      }

      logger.info(`Reviewer invitations sent to ${emailJobs.length} teachers`);

      return res.json({
        message: `Invitations sent successfully to ${emailJobs.length} reviewer(s)`,
        invitedCount: emailJobs.length
      });

    } catch (error) {
      console.error("Error sending invitations:", error);
      logger.error("Reviewer invitations error:", error);

      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages
        });
      }

      const isDevelopment = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Failed to send invitations",
        ...(isDevelopment && { details: error.message })
      });
    }
  }

  // POST /api/reviewers/add - Add a reviewer manually
  static async addReviewer(req, res) {
    try {
      const validator = vine.compile(addReviewerSchema);
      const payload = await validator.validate(req.body);

      // Check if teacher exists and is verified
      const teacher = await prisma.teacher.findUnique({
        where: { teacher_id: payload.teacher_id },
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
              email: true,
              isVerified: true,
              role: true
            }
          }
        }
      });

      if (!teacher) {
        return res.status(404).json({
          error: "Teacher not found"
        });
      }

      if (!teacher.user?.isVerified) {
        return res.status(400).json({
          error: "Teacher's email is not verified"
        });
      }

      if (teacher.user?.role !== 'TEACHER') {
        return res.status(400).json({
          error: "User must have TEACHER role"
        });
      }

      // Check if already a reviewer (idempotent approach)
      const existingReviewer = await prisma.reviewer.findUnique({
        where: { teacher_id: payload.teacher_id }
      });

      if (existingReviewer) {
        // Already a reviewer - just return success (idempotent)
        return res.json({
          message: "Teacher is already a reviewer",
          reviewer_id: existingReviewer.reviewer_id
        });
      }

      // Use transaction to add reviewer and update teacher status
      const result = await prisma.$transaction(async (tx) => {
        // Update teacher to mark as reviewer
        await tx.teacher.update({
          where: { teacher_id: payload.teacher_id },
          data: { isReviewer: true }
        });

        // Create reviewer record
        const newReviewer = await tx.reviewer.create({
          data: {
            reviewer_id: payload.teacher_id, // Use teacher_id as reviewer_id
            teacher_id: payload.teacher_id,
            status: 'ACTIVE'
          }
        });

        // Add domain preferences if provided
        if (payload.domain_ids && Array.isArray(payload.domain_ids) && payload.domain_ids.length > 0) {
          // Verify domains exist first
          const validDomains = await tx.domain.findMany({
            where: { domain_id: { in: payload.domain_ids } }
          });

          if (validDomains.length > 0) {
            await tx.reviewerpreference.createMany({
              data: validDomains.map(domain => ({
                reviewer_id: newReviewer.reviewer_id,
                domain_id: domain.domain_id
              }))
            });
          }
        }

        return newReviewer;
      });

      // Send welcome email if email is available
      if (teacher.user?.email) {
        const welcomeEmail = {
          toEmail: teacher.user.email,
          subject: "Welcome to the Review Committee",
          body: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #16a34a;">Welcome to the Review Committee!</h2>
              
              <p>Dear ${teacher.user.name || 'Professor'},</p>
              
              <p>Congratulations! You have been successfully added to our review committee.</p>
              
              <p>You can now:</p>
              <ul>
                <li>Review assigned papers and proposals</li>
                <li>Access the reviewer dashboard</li>
                <li>Manage your review preferences</li>
              </ul>
              
              <div style="margin: 30px 0;">
                <a href="${process.env.UI_URL || 'http://localhost:5173'}/login" 
                   style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Access Reviewer Dashboard
                </a>
              </div>
              
              <p>Thank you for joining our review committee!</p>
              
              <p>Best regards,<br>The Review Committee Team</p>
            </div>
          `
        };

        try {
          await emailQueue.add(emailQueueName, [welcomeEmail]);
        } catch (emailError) {
          logger.error("Error sending welcome email:", emailError);
          // Don't fail the request if email fails
        }
      }

      logger.info(`New reviewer added: ${teacher.user?.name} (ID: ${result.reviewer_id})`);

      return res.status(201).json({
        message: "Reviewer added successfully",
        reviewer_id: result.reviewer_id
      });

    } catch (error) {
      console.error("Error adding reviewer:", error);
      logger.error("Add reviewer error:", error);

      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages
        });
      }

      const isDevelopment = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        error: "Failed to add reviewer",
        ...(isDevelopment && { details: error.message })
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
          // Don't fail the request if email fails
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
        // Remove reviewer preferences
        await tx.reviewerpreference.deleteMany({
          where: { reviewer_id: reviewerId }
        });

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
          // Don't fail the request if email fails
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

      // Safely process assignments
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