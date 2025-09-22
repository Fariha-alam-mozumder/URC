// controllers/ProposalController.js
import db from "../../DB/db.config.js";
import { proposalValidator } from "../../validations/teacher/proposalValidation.js";
import { fileValidator, uploadFile } from "../../utils/helper.js";
import { errors } from "@vinejs/vine";

class ProposalController {
  static async upload(req, res) {
    console.log("Files received:", req.files);

    try {
      // Validate proposal metadata (title, abstract, team_id)
      const payload = await proposalValidator.validate({
        ...req.body,
        team_id: Number(req.body.team_id),
      });

      // Validate that a file is uploaded
      const file = req.files?.proposal;
      if (!file) {
        return res
          .status(400)
          .json({ errors: { proposal: "Proposal file is required" } });
      }

      // ✅ NEW SIGNATURE: validate file (100MB cap, default allowed: PDF/DOC/DOCX)
      try {
        fileValidator(file, { maxSizeMB: 100 });
        // If you want PDF-only, use:
        // fileValidator(file, { maxSizeMB: 100, allowedMimes: ["application/pdf"] });
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

      // Upload file to disk (stored under public/documents)
      const pdf_path = await uploadFile(file, true, "pdf");

      // Save proposal record linked to team
      const proposal = await db.proposal.create({
        data: {
          title: payload.title,
          abstract: payload.abstract,
          pdf_path,
          team_id: Number(payload.team_id),
          submitted_by: teacher.teacher_id,
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
              user: { select: { name: true, email: true } },
            },
          },
          team: {
            include: {
              domain: { select: { domain_name: true } },
            },
          },
        },
        orderBy: { created_at: "desc" },
      });

      return res.json({ data: proposals });
    } catch (err) {
      console.error("Get team proposals error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteProposal(req, res) {
    try {
      const { proposalId } = req.params;
      const userId = Number(req.user.id);

      // Get teacher record
      const teacher = await db.teacher.findFirst({
        where: { user_id: userId }
      });

      if (!teacher) {
        return res.status(403).json({ error: "Only teachers can delete proposals" });
      }

      // Find proposal and verify ownership
      const proposal = await db.proposal.findFirst({
        where: {
          proposal_id: Number(proposalId),
          submitted_by: teacher.teacher_id
        }
      });

      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found or unauthorized" });
      }

      // Delete the proposal
      await db.proposal.delete({
        where: { proposal_id: Number(proposalId) }
      });

      // Optionally delete the physical file
      if (proposal.pdf_path) {
        try {
          const fs = await import("fs");
          const path = await import("path");
          const filePath = path.join(process.cwd(), "public", proposal.pdf_path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileErr) {
          console.warn("Could not delete file:", fileErr);
        }
      }

      return res.json({ message: "Proposal deleted successfully" });
    } catch (err) {
      console.error("Delete proposal error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default ProposalController;
