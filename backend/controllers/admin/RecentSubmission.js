import prisma from "../../DB/db.config.js";
import { Vine, errors } from "@vinejs/vine";
import { recentSubmissionSchema } from "../../validations/admin/RecentSubmissionValidation.js";

const vine = new Vine();

class RecentSubmissionController {
  // GET /admin/recent-submissions
  static async getAllSubmissions(req, res) {
    try {
      const validator = vine.compile(recentSubmissionSchema);
      const filters = await validator.validate(req.query);

      const { type, startDate, endDate, teamId } = filters;

      let submissions = [];

      // Fetch papers if type is PAPER or not specified
      if (!type || type === "PAPER") {
        const papers = await prisma.paper.findMany({
          where: {
            ...(teamId && { team_id: teamId }),
            ...(startDate && { created_at: { gte: new Date(startDate) } }),
            ...(endDate && { created_at: { lte: new Date(endDate) } }),
          },
          include: {
            team: { select: { team_id: true, team_name: true } },
            teacher: { select: { teacher_id: true, user: { select: { name: true, email: true } } } },
            review: true,
            reviewerassignment: true,
          },
          orderBy: { created_at: "desc" },
        });
        submissions = submissions.concat(
          papers.map((p) => ({ ...p, submissionType: "PAPER" }))
        );
      }

      // Fetch proposals if type is PROPOSAL or not specified
      if (!type || type === "PROPOSAL") {
        const proposals = await prisma.proposal.findMany({
          where: {
            ...(teamId && { team_id: teamId }),
            ...(startDate && { created_at: { gte: new Date(startDate) } }),
            ...(endDate && { created_at: { lte: new Date(endDate) } }),
          },
          include: {
            team: { select: { team_id: true, team_name: true } },
            teacher: { select: { teacher_id: true, user: { select: { name: true, email: true } } } },
            review: true,
            reviewerassignment: true,
          },
          orderBy: { created_at: "desc" },
        });
        submissions = submissions.concat(
          proposals.map((p) => ({ ...p, submissionType: "PROPOSAL" }))
        );
      }

      // Sort all submissions by created_at descending
      submissions.sort((a, b) => b.created_at - a.created_at);

      return res.status(200).json({
        success: true,
        count: submissions.length,
        submissions,
      });
    } catch (error) {
      console.error("RecentSubmission error:", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      }
      return res.status(500).json({
        error: "Something went wrong while fetching recent submissions.",
      });
    }
  }
}

export default RecentSubmissionController;
