// controllers/ProposalController.js
import db from "../../DB/db.config.js";
import { proposalValidator } from "../../validations/proposalValidation.js";
import { fileValidator, uploadFile } from "../../utils/helper.js";
import { errors } from "@vinejs/vine";

class ProposalController {
  static async upload(req, res) {
    console.log("Files received:", req.files);

    try {
      // Validate proposal metadata (title, abstract, team_id)
      // Convert team_id to number before validation
      const payload = await proposalValidator.validate({
        ...req.body,
        team_id: Number(req.body.team_id),
      });

      // Validate that a PDF file is uploaded
      const file = req.files?.proposal;
      if (!file) {
        return res
          .status(400)
          .json({ errors: { proposal: "Proposal PDF file is required" } });
      }

      // Validate file size and mimetype (max 100MB, PDF only)
      try {
        fileValidator(100, file.mimetype)(file);
      } catch (e) {
        return res.status(400).json({ errors: { proposal: e.message } });
      }

      // Get teacher record for the logged-in user
      const teacher = await db.teacher.findFirst({
        where: { user_id: Number(req.user.id) }
      });

      if (!teacher) {
        return res.status(400).json({ error: "User is not a teacher" });
      }

      // Upload PDF file to disk
      const pdf_path = await uploadFile(file, true, "pdf");

      // Save proposal record linked to team
      const proposal = await db.proposal.create({
        data: {
          title: payload.title,
          abstract: payload.abstract,
          pdf_path,
          team_id: Number(payload.team_id),
          submitted_by: teacher.teacher_id,
          domain_id: payload.domain_id || null,
          file_size: file.size,
          status: "PENDING",
        },
      });

      return res.status(201).json({
        status: 201,
        message: "Proposal uploaded successfully",
        data: proposal,
      });
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return res.status(422).json({ errors: err.messages });
      }
      console.error("Proposal upload error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Get proposals for a specific team
  static async getTeamProposals(req, res) {
    try {
      const { teamId } = req.params;
      
      const proposals = await db.proposal.findMany({
        where: { team_id: Number(teamId) },
        include: {
          teacher: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            }
          },
          domain: {
            select: { domain_name: true }
          }
        },
        orderBy: { created_at: 'desc' }
      });

      return res.json({ data: proposals });
    } catch (err) {
      console.error("Get team proposals error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default ProposalController;