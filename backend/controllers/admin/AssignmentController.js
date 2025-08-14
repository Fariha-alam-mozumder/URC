import prisma from "../../DB/db.config.js";
import redis from "../../DB/redis.config.js";
import { Vine, errors } from "@vinejs/vine";
import { assignReviewerSchema, bulkAssignmentSchema } from "../../validations/admin/assignmentValidation.js";
import { emailQueue, emailQueueName } from "../../jobs/SendEmailJob.js";
import logger from "../../config/logger.js";

const vine = new Vine();

// Helper to include assignment relations
const includeAssignmentDetails = () => ({
  reviewer: {
    include: {
      teacher: {
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      }
    }
  },
  paper: { select: { title: true, paper_id: true } },
  proposal: { select: { title: true, proposal_id: true } }
});

// Helper to build email jobs
const buildEmailJob = (assignment) => {
  const itemTitle = assignment.paper?.title || assignment.proposal?.title;
  const itemType = assignment.paper ? 'Paper' : 'Proposal';
  const itemId = assignment.paper?.paper_id || assignment.proposal?.proposal_id;

  return {
    toEmail: assignment.reviewer.teacher.user.email,
    subject: `New ${itemType} Assignment for Review`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Review Assignment</h2>
        <p>Dear ${assignment.reviewer.teacher.user.name},</p>
        <p>You have been assigned to review a new ${itemType.toLowerCase()}:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Title:</strong> ${itemTitle}<br>
          <strong>Type:</strong> ${itemType}<br>
          <strong>ID:</strong> ${itemType === 'Paper' ? 'P' : 'PR'}${itemId.toString().padStart(3, 0)}
        </div>
        <p>Please log into your reviewer dashboard to access the ${itemType.toLowerCase()} and submit your review.</p>
        <p>Thank you for your contribution to the review process.</p>
        <p>Best regards,<br>Academic Review System</p>
      </div>
    `,
  };
};

class AssignmentController {

  // Get waiting papers/proposals
static async getWaitingAssignments(req, res) {
  try {
    const cacheKey = "/api/assignments/waiting";
    let response = null;

    // Try reading from Redis cache, but don't crash if Redis fails
   try {
  const cached = await redis.get(cacheKey);
  if (cached) {
    const response = JSON.parse(cached);
    return res.json(response);
  }
} catch (err) {
  console.warn("Redis cache read failed, continuing without cache:", err.message);
}


    // Fetch waiting papers & proposals
    const [papersWaiting, proposalsWaiting] = await Promise.all([
      prisma.paper.findMany({
        where: { status: "PENDING", reviewerassignment: { none: {} } },
        include: {
          team: { select: { team_name: true } },
          teacher: { include: { user: { select: { name: true } } } },
          domain: { select: { domain_name: true } }
        },
        orderBy: { created_at: 'asc' }
      }),
      prisma.proposal.findMany({
        where: { status: "PENDING", reviewerassignment: { none: {} } },
        include: {
          team: { select: { team_name: true } },
          teacher: { include: { user: { select: { name: true } } } },
          domain: { select: { domain_name: true } }
        },
        orderBy: { created_at: 'asc' }
      })
    ]);

    // Map to frontend structure
    const formatItems = (items, prefix) => items.map(i => ({
      id: prefix + (prefix === 'P' ? i.paper_id : i.proposal_id).toString().padStart(3, '0'),
      type: prefix === 'P' ? 'paper' : 'proposal',
      actual_id: prefix === 'P' ? i.paper_id : i.proposal_id,
      category: i.domain?.domain_name || 'General',
      title: i.title,
      authors: i.teacher?.user?.name || 'Unknown Author',
      submittedDate: i.created_at.toISOString().split('T')[0],
      abstract: i.abstract || 'No abstract provided',
      team_name: i.team?.team_name,
      keywords: [],
      domain_id: i.domain_id
    }));

    const waitingItems = [...formatItems(papersWaiting, 'P'), ...formatItems(proposalsWaiting, 'PR')];

    // Count reviewers
    const availableReviewers = await prisma.reviewer.count({
      where: { status: 'ACTIVE', teacher: { isReviewer: true, user: { isVerified: true } } }
    });

    // Count auto-matchable items
    let autoMatchAvailable = 0;
    for (const item of waitingItems) {
      if (!item.domain_id) continue;
      const matching = await prisma.reviewer.count({
        where: {
          status: 'ACTIVE',
          reviewerpreference: { some: { domain_id: item.domain_id } },
          teacher: { isReviewer: true, user: { isVerified: true } }
        }
      });
      if (matching > 0) autoMatchAvailable++;
    }

    response = { waitingItems, stats: { awaitingAssignment: waitingItems.length, availableReviewers, autoMatchAvailable } };

    // Try setting cache, but don't crash if Redis fails
    try { await redis.setex(cacheKey, 300, JSON.stringify(response)); } 
    catch (err) { console.warn("Redis cache write failed:", err.message); }

    return res.json(response);

  } catch (err) {
    console.error("Get waiting assignments error:", err);
    return res.status(500).json({ error: "Failed to fetch waiting assignments." });
  }
}

  // Get available reviewers
 // Get available reviewers
static async getAvailableReviewers(req, res) {
  try {
    const { domain_id, item_type, item_id } = req.query;

    // Fetch the team_id of the submission if provided
    let itemTeamId = null;
    if (item_type && item_id) {
      const item = item_type === 'paper'
        ? await prisma.paper.findUnique({ where: { paper_id: parseInt(item_id) }, select: { team_id: true } })
        : await prisma.proposal.findUnique({ where: { proposal_id: parseInt(item_id) }, select: { team_id: true } });

      itemTeamId = item?.team_id || null;
    }

    const whereClause = {
      status: 'ACTIVE',
      teacher: { isReviewer: true, user: { isVerified: true } },
      // Exclude reviewers from the same team as the submission
      ...(itemTeamId ? { teacher: { ...{ team_id: { not: itemTeamId } } } } : {})
    };

    // If domain specified, prioritize matching reviewers
    let reviewersWithDomain = [];
    let otherReviewers = [];

    if (domain_id) {
      const domainId = parseInt(domain_id);

      reviewersWithDomain = await prisma.reviewer.findMany({
        where: { ...whereClause, reviewerpreference: { some: { domain_id: domainId } } },
        include: {
          teacher: { include: { user: { select: { name: true, email: true } }, department: { select: { department_name: true } } } },
          reviewerpreference: { include: { domain: { select: { domain_name: true } } } },
          reviewerassignment: { select: { assignment_id: true } }
        }
      });

      otherReviewers = await prisma.reviewer.findMany({
        where: { ...whereClause, NOT: { reviewerpreference: { some: { domain_id: domainId } } } },
        include: {
          teacher: { include: { user: { select: { name: true, email: true } }, department: { select: { department_name: true } } } },
          reviewerpreference: { include: { domain: { select: { domain_name: true } } } },
          reviewerassignment: { select: { assignment_id: true } }
        }
      });
    } else {
      reviewersWithDomain = await prisma.reviewer.findMany({
        where: whereClause,
        include: {
          teacher: { include: { user: { select: { name: true, email: true } }, department: { select: { department_name: true } } } },
          reviewerpreference: { include: { domain: { select: { domain_name: true } } } },
          reviewerassignment: { select: { assignment_id: true } }
        }
      });
    }

    const allReviewers = [...reviewersWithDomain, ...otherReviewers];
    const formattedReviewers = allReviewers.map(r => ({
      id: r.reviewer_id,
      name: r.teacher?.user?.name || 'Unknown',
      email: r.teacher?.user?.email || '',
      department: r.teacher?.department?.department_name || 'Unknown',
      domain: r.reviewerpreference?.map(p => p.domain.domain_name) || [],
      currentAssignments: r.reviewerassignment?.length || 0,
      isExpertMatch: reviewersWithDomain.includes(r)
    }));

    return res.json(formattedReviewers);

  } catch (error) {
    console.error("Get available reviewers error:", error);
    return res.status(500).json({ error: "Something went wrong while fetching available reviewers." });
  }
}


  // Assign reviewers
  static async assignReviewers(req, res) {
    try {
      const validator = vine.compile(bulkAssignmentSchema);
      const payload = await validator.validate(req.body);
      const { assignments } = payload;
      const assignedBy = req.user.id;

      const admin = await prisma.admin.findFirst({ where: { user: { user_id: assignedBy } } });
      if (!admin) return res.status(403).json({ error: "Only admins can assign reviewers." });

      const createdAssignments = [];
      const emailJobs = [];

      for (const assignment of assignments) {
        const { item_id, item_type, reviewer_ids } = assignment;

        // Fetch item including team_id
        const item = item_type === 'paper'
          ? await prisma.paper.findUnique({ where: { paper_id: parseInt(item_id) }, select: { team_id: true, title: true } })
          : await prisma.proposal.findUnique({ where: { proposal_id: parseInt(item_id) }, select: { team_id: true, title: true } });

        if (!item) continue;

        // Prevent admin/teacher from assigning their own team's submissions
        const adminTeacher = await prisma.teacher.findUnique({ where: { teacher_id: admin.teacher_id } });
        if (adminTeacher?.team_id && adminTeacher.team_id === item.team_id) {
          return res.status(403).json({ error: "You cannot assign reviewers for submissions from your own team." });
        }

        for (const reviewer_id of reviewer_ids) {
          const reviewer = await prisma.reviewer.findUnique({
            where: { reviewer_id: parseInt(reviewer_id) },
            select: { teacher: { select: { team_id: true } } }
          });

          if (reviewer?.teacher?.team_id && reviewer.teacher.team_id === item.team_id) {
            logger.warn(`Reviewer ${reviewer_id} cannot be assigned to their own team's ${item_type} ${item_id}`);
            continue;
          }

          const assignmentData = {
            reviewer_id: parseInt(reviewer_id),
            assigned_by: admin.admin_id,
            ...(item_type === 'paper' ? { paper_id: parseInt(item_id) } : { proposal_id: parseInt(item_id) })
          };

          const newAssignment = await prisma.reviewerassignment.create({
            data: assignmentData,
            include: includeAssignmentDetails()
          });

          createdAssignments.push(newAssignment);
          emailJobs.push(buildEmailJob(newAssignment));
        }

        // Update item status
        const updateData = { status: 'UNDER_REVIEW' };
        if (item_type === 'paper') await prisma.paper.update({ where: { paper_id: parseInt(item_id) }, data: updateData });
        else await prisma.proposal.update({ where: { proposal_id: parseInt(item_id) }, data: updateData });
      }

      if (emailJobs.length > 0) await emailQueue.add(emailQueueName, emailJobs);

      try {
        await redis.del("/api/assignments/waiting");
        await redis.del("/api/reviewers");
      } catch (cacheErr) { logger.warn("Redis cache clear failed:", cacheErr); }

      logger.info(`${createdAssignments.length} reviewer assignments created by admin ${assignedBy}`);

      return res.json({
        status: 200,
        message: `Successfully assigned ${createdAssignments.length} reviewers.`,
        assignments_created: createdAssignments.length
      });

    } catch (error) {
      console.error("Assign reviewers error:", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      }
      return res.status(500).json({ error: "Something went wrong while assigning reviewers." });
    }
  }

  // Auto-match reviewers
  static async autoMatchReviewers(req, res) {
    try {
      const { item_id, item_type } = req.body;

      const item = item_type === 'paper'
        ? await prisma.paper.findUnique({ where: { paper_id: parseInt(item_id) }, select: { domain_id: true, team_id: true, title: true } })
        : await prisma.proposal.findUnique({ where: { proposal_id: parseInt(item_id) }, select: { domain_id: true, team_id: true, title: true } });

      if (!item || !item.domain_id) return res.status(400).json({ error: "Item not found or has no domain specified." });

      const matchingReviewers = await prisma.reviewer.findMany({
        where: {
          status: 'ACTIVE',
          reviewerpreference: { some: { domain_id: item.domain_id } },
          teacher: { isReviewer: true, user: { isVerified: true } }
        },
        include: { teacher: { include: { user: { select: { name: true, email: true } } } }, reviewerassignment: { select: { assignment_id: true } } }
      });

      // Filter out reviewers from the same team
      const filteredReviewers = matchingReviewers.filter(r => r.teacher.team_id !== item.team_id);

      const sortedReviewers = filteredReviewers.sort((a, b) => a.reviewerassignment.length - b.reviewerassignment.length);

      const recommendations = sortedReviewers.slice(0, 3).map(r => ({
        id: r.reviewer_id,
        name: r.teacher.user.name,
        email: r.teacher.user.email,
        currentAssignments: r.reviewerassignment.length,
        matchScore: 100
      }));

      return res.json({ item_title: item.title, recommendations, total_matches: filteredReviewers.length });

    } catch (error) {
      console.error("Auto-match reviewers error:", error);
      return res.status(500).json({ error: "Something went wrong while finding reviewer matches." });
    }
  }

}

export default AssignmentController;
