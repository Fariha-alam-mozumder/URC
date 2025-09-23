// middleware/reviewerOnly.js
import prisma from "../DB/db.config.js";

const reviewerOnly = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const teacher = await prisma.teacher.findFirst({
      where: { user_id: userId },
      include: { reviewer: true },
    });

    if (!teacher?.reviewer || teacher.reviewer.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Reviewer access required",
      });
    }

    req.context = {
      teacher_id: teacher.teacher_id,
      reviewer_id: teacher.reviewer.reviewer_id,
    };

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
export default reviewerOnly;