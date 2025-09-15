// controllers/reviewer/ReviewController.js
import path from "path";
import fs from "fs";
import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";
import { Vine } from "@vinejs/vine";
import { reviewSchema } from "../../validations/reviewer/reviewValidation.js";
import redis from "../../DB/redis.client.js";
import { teamDetailsKey, userTeamsKey } from "../../utils/cacheKeys.js";
import { finalizeIfCompleted } from "../../utils/finalizeIfCompleted.js";
import {
  fileValidator,
  uploadFile,
  getDocumentUrl,
  MAX_DOCUMENT_SIZE_MB
} from "../../utils/helper.js";

const vine = new Vine();

const parseCode = (rawCode) => {
  const s = String(rawCode || "").trim().toUpperCase();
  const lettersOnly = s.replace(/[^A-Z]/g, "");
  const digitsMatch = s.match(/\d+/);
  const id = digitsMatch ? parseInt(digitsMatch[0], 10) : null;
  if (!id || id <= 0) return { isProposal: null, id: null };
  const isProposal = lettersOnly.startsWith("PR");
  return { isProposal, id };
};

const mapDecisionToStatus = (decision) => {
  switch (decision) {
    case "ACCEPT":
      return "ACCEPTED";
    case "REJECT":
      return "REJECTED";
    case "MINOR_REVISIONS":
    case "MAJOR_REVISIONS":
    default:
      return "UNDER_REVIEW";
  }
};

class ReviewController {
  static async getItemForReviewByCode(req, res) {
    try {
      const { code } = req.params;
      const { isProposal, id } = parseCode(code);
      if (!id) return res.status(400).json({ success: false, message: "Invalid code" });

      const item = isProposal
        ? await prisma.proposal.findUnique({
          where: { proposal_id: id },
          include: {
            team: { include: { domain: true } },
            teacher: { include: { user: { select: { name: true, email: true } } } },
          },
        })
        : await prisma.paper.findUnique({
          where: { paper_id: id },
          include: {
            team: { include: { domain: true } },
            teacher: { include: { user: { select: { name: true, email: true } } } },
          },
        });

      if (!item) return res.status(404).json({ success: false, message: "Not found" });

      const reviewerId = req.context?.reviewer_id;
      if (!reviewerId) {
        return res.status(401).json({ success: false, message: "Reviewer context missing" });
      }

      const assigned = await prisma.reviewerassignment.findFirst({
        where: isProposal
          ? { proposal_id: id, reviewer_id: reviewerId }
          : { paper_id: id, reviewer_id: reviewerId },
      });
      if (!assigned) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to review this item",
        });
      }

      const data = {
        code: (isProposal ? "PR" : "P") + String(id).padStart(3, "0"),
        numericId: id,
        type: isProposal ? "proposal" : "paper",
        title: item.title || "Untitled",
        abstract: item.abstract || "",
        status: item.status || "PENDING",
        submittedBy: item.teacher?.user?.name || "Unknown",
        email: item.teacher?.user?.email || "",
        submittedAt: item.created_at,
        track: item.team?.domain?.domain_name || "Unknown",
        teamName: item.team?.team_name || null, // <-- add for UI
        pdf_path: item.pdf_path || null,
        pdf_url: item.pdf_path ? getDocumentUrl(item.pdf_path) : null,
        file_size: item.file_size || null,
      };

      return res.status(200).json({ success: true, data });
    } catch (err) {
      logger.error("getItemForReviewByCode error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async downloadItemPdfByCode(req, res) {
    try {
      const { code } = req.params;
      const { isProposal, id } = parseCode(code);
      if (!id) return res.status(400).json({ success: false, message: "Invalid code" });

      const item = isProposal
        ? await prisma.proposal.findUnique({ where: { proposal_id: id } })
        : await prisma.paper.findUnique({ where: { paper_id: id } });

      if (!item || !item.pdf_path) {
        return res.status(404).json({ success: false, message: "PDF not found" });
      }

      const reviewerId = req.context?.reviewer_id;
      if (!reviewerId) {
        return res.status(401).json({ success: false, message: "Reviewer context missing" });
      }
      const assigned = await prisma.reviewerassignment.findFirst({
        where: isProposal
          ? { proposal_id: id, reviewer_id: reviewerId }
          : { paper_id: id, reviewer_id: reviewerId },
      });
      if (!assigned) {
        return res.status(403).json({ success: false, message: "Not authorized for this file" });
      }

      const safeRel = String(item.pdf_path).replace(/^\/+/, "");
      const fileAbs = path.join(process.cwd(), "public", safeRel);
      if (!fs.existsSync(fileAbs)) {
        return res.status(404).json({ success: false, message: "File missing on server" });
      }

      return res.download(fileAbs, path.basename(fileAbs));
    } catch (err) {
      logger.error("downloadItemPdfByCode error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async submitReviewByCode(req, res) {
    try {
      const { code } = req.params;
      const { isProposal, id } = parseCode(code);
      if (!id) return res.status(400).json({ success: false, message: "Invalid code" });

      const reviewerId = req.context?.reviewer_id;
      if (!reviewerId) {
        return res.status(401).json({ success: false, message: "Reviewer context missing" });
      }

      const assignment = await prisma.reviewerassignment.findFirst({
        where: isProposal
          ? { proposal_id: id, reviewer_id: reviewerId }
          : { paper_id: id, reviewer_id: reviewerId },
      });
      if (!assignment) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this item",
        });
      }

      // ---- Validate payload ----
      const payload = {
        originality: Number(req.body.originality),
        methodology: Number(req.body.methodology),
        clarity: Number(req.body.clarity),
        relevance: Number(req.body.relevance),
        presentation: Number(req.body.presentation),
        feedback: String(req.body.feedback || "").trim(),
        decision: String(req.body.decision || "").toUpperCase().replace(/\s+/g, "_"),
      };
      const validator = vine.compile(reviewSchema);
      const validated = await validator.validate(payload);

      // ---- Optional annotated file upload ----
      let attachmentPath = null;
      const file = req.files?.review_file;
      if (file) {
        // Validate size + mime (PDF/DOC/DOCX)
        fileValidator(file); // (20MB + supportedDocumentMimes)
        attachmentPath = await uploadFile(file, true, "pdf"); // stored under public/documents
      }

      // ---- Create review ----
      const avg =
        (validated.originality +
          validated.methodology +
          validated.clarity +
          validated.relevance +
          validated.presentation) / 5;

      const review = await prisma.review.create({
        data: {
          reviewer_id: reviewerId,
          paper_id: isProposal ? null : id,
          proposal_id: isProposal ? id : null,
          comments: JSON.stringify({
            rubric: {
              originality: validated.originality,
              methodology: validated.methodology,
              clarity: validated.clarity,
              relevance: validated.relevance,
              presentation: validated.presentation,
            },
            feedback: validated.feedback,
            attachment: attachmentPath,
          }),
          score: Math.round(avg),
          decision: validated.decision,
        },
      });

      // ---- Mark assignment completed (+ timestamps) ----
      const now = new Date();
      await prisma.reviewerassignment.update({
        where: { assignment_id: assignment.assignment_id },
        data: {
          status: "COMPLETED",
          completed_at: now,
          // if reviewer never hit "Start", ensure we still have a start stamp for analytics
          started_at: assignment.started_at ?? now,
        },
      });

      // ---- Try finalization (admin-facing rollup & aggregate decision persistence) ----
      const { finalized, adminStatus, aggregated } = await finalizeIfCompleted(
        isProposal ? "proposal" : "paper",
        id
      );

      // ---- Invalidate team cache (team page reflects latest state) ----
      try {
        const parent = isProposal
          ? await prisma.proposal.findUnique({ where: { proposal_id: id }, select: { team_id: true } })
          : await prisma.paper.findUnique({ where: { paper_id: id }, select: { team_id: true } });
        if (parent?.team_id) {
          try { await redis.del(teamDetailsKey(parent.team_id)); } catch { }
        }
      } catch { }

      // ---- Respond ----
      return res.status(201).json({
        success: true,
        message: "Review submitted",
        review_id: review.review_id,
        // admin-facing aggregate lifecycle
        admin_assignment_status: adminStatus,
        aggregated_decision: finalized ? aggregated : null,
        attachment: attachmentPath ? getDocumentUrl(attachmentPath) : null,
      });
    } catch (err) {
      logger.error("submitReviewByCode error:", err);
      return res.status(400).json({
        success: false,
        message: err?.message || "Validation or upload error",
      });
    }
  }

}

export default ReviewController;
