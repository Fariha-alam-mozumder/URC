// controllers/secure/DownloadController.js
import path from "path";
import fs from "fs/promises";
import { createReadStream } from "fs";
import prisma from "../../DB/db.config.js";

const STORAGE_ROOT = process.env.STORAGE_ROOT || path.resolve(process.cwd(), "public/");


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
      },
    });

    if (!paper || !paper.pdf_path) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

  

    const absolute = resolveAbsolutePath(paper.pdf_path);

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
