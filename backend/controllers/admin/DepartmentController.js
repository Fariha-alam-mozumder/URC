// backend/controllers/admin/DepartmentController.js
import prisma from "../../DB/db.config.js";
import logger from "../../config/logger.js";

class DepartmentController {
  static async list(req, res) {
    try {
      const rows = await prisma.department.findMany({
        select: { department_id: true, department_name: true },
        orderBy: { department_name: "asc" },
      });
      return res.json({ success: true, departments: rows });
    } catch (e) {
      logger.error("Department list error:", e);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
}

export default DepartmentController;
