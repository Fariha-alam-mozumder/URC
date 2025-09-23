// controllers/PaperController.js
import db from "../../DB/db.config.js";
import { paperValidator } from "../../validations/teacher/paperValidation.js";
import { fileValidator, uploadFile } from "../../utils/helper.js";
import { errors } from "@vinejs/vine";

class PaperController {
  static async upload(req, res) {
    console.log("Files received:", req.files);

    try {
      const payload = await paperValidator.validate({
        ...req.body,
        team_id: Number(req.body.team_id),
      });

      // Validate that a file is uploaded
      const file = req.files?.paper;
      if (!file) {
        return res
          .status(400)
          .json({ errors: { paper: "Paper file is required" } });
      }

      try {
        fileValidator(file, { maxSizeMB: 100 });

      } catch (e) {
        return res.status(400).json({ errors: { paper: e.message } });
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

      // Save paper record linked to team
      const paper = await db.paper.create({
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
        message: "Paper uploaded successfully",
        data: paper,
      });
    } catch (err) {
      if (err instanceof errors.E_VALIDATION_ERROR) {
        return res.status(422).json({ errors: err.messages });
      }
      console.error("Paper upload error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Get papers for a specific team
  static async getTeamPapers(req, res) {
    try {
      const { teamId } = req.params;

      const papers = await db.paper.findMany({
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

      return res.json({ data: papers });
    } catch (err) {
      console.error("Get team papers error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deletePaper(req, res) {
    try {
      const { paperId } = req.params;
      const userId = Number(req.user.id);

      // Get teacher record
      const teacher = await db.teacher.findFirst({
        where: { user_id: userId }
      });

      if (!teacher) {
        return res.status(403).json({ error: "Only teachers can delete papers" });
      }

      // Find paper and verify ownership
      const paper = await db.paper.findFirst({
        where: {
          paper_id: Number(paperId),
          submitted_by: teacher.teacher_id
        }
      });

      if (!paper) {
        return res.status(404).json({ error: "Paper not found or unauthorized" });
      }

      // Delete the paper
      await db.paper.delete({
        where: { paper_id: Number(paperId) }
      });

      // Optionally delete the physical file
      if (paper.pdf_path) {
        try {
          const fs = await import("fs");
          const path = await import("path");
          const filePath = path.join(process.cwd(), "public", paper.pdf_path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileErr) {
          console.warn("Could not delete file:", fileErr);
        }
      }

      return res.json({ message: "Paper deleted successfully" });
    } catch (err) {
      console.error("Delete paper error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default PaperController;
