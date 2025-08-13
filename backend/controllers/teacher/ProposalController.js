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

      // Validate file size and mimetype (max 10MB, PDF only)
      try {
        fileValidator(10, file.mimetype)(file);
      } catch (e) {
        return res.status(400).json({ errors: { proposal: e.message } });
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
          submitted_by: req.user.user_id, // assuming logged in user is teacher
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
}

export default ProposalController;
