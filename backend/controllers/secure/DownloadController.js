// controllers/secure/DownloadController.js
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import prisma from "../../DB/db.config.js";

/**
 * Safely resolve your storage path. You can:
 *  - hardcode your storage directory (e.g., ./storage/papers)
 *  - or inject via env (recommended)
 */
const STORAGE_ROOT = process.env.STORAGE_ROOT || path.resolve(process.cwd(), "public/");

/**
 * Turn DB pdf_path (which might be relative like 'uploads/papers/123.pdf'
 * or absolute) into a safe absolute path within STORAGE_ROOT.
 */
function resolveAbsolutePath(pdf_path = "") {
  // Sanitize & normalize
  const clean = String(pdf_path).replace(/^\/+/, "");
  const abs = path.resolve(STORAGE_ROOT, clean);
  // Prevent path traversal outside storage root
  if (!abs.startsWith(STORAGE_ROOT)) {
    throw new Error("Invalid file path.");
  }
  return abs;
}

export async function downloadPaper(req, res) {
  try {
    const paperId = Number(req.params.id);
    if (!Number.isFinite(paperId)) {
      return res.status(400).json({ success: false, message: "Invalid paper id" });
    }

    const paper = await prisma.paper.findUnique({
      where: { paper_id: paperId },
      select: {
        pdf_path: true,
        paper_id: true,
        // Optionally: visibility / ownership, domain, etc. for authorization
      },
    });

    if (!paper || !paper.pdf_path) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // 🔒 Authorization (optional but recommended)
    // Example: only logged-in users
    // if (!req.user) return res.status(403).json({ success: false, message: "Forbidden" });
    // Example: only certain roles:
    // if (!["TEACHER", "STUDENT", "ADMIN"].includes(req.user.role)) {
    //   return res.status(403).json({ success: false, message: "Forbidden" });
    // }

    const absolute = resolveAbsolutePath(paper.pdf_path);

    // Confirm file exists and get size
    let stat;
    try {
      stat = await fs.stat(absolute);
      if (!stat.isFile()) throw new Error("Not a file");
    } catch {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Disposition", `inline; filename="paper-${paperId}.pdf"`);

    const stream = createReadStream(absolute);
    stream.on("error", (err) => {
      console.error("downloadPaper stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Server error" });
      } else {
        res.end();
      }
    });
    return stream.pipe(res);
  } catch (e) {
    console.error("downloadPaper error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
