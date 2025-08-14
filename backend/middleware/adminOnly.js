import prisma from "../DB/db.config.js";

// Middleware to check if user is an admin
const adminOnly = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Check if user has admin role or is main admin
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        role: true,
        isMainAdmin: true,
      }
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }

    // Check if user is admin or main admin
    if (user.role !== 'ADMIN' && !user.isMainAdmin) {
      return res.status(403).json({
        error: "Access denied. Admin privileges required."
      });
    }

    // Check if admin record exists in admin table
    const adminRecord = await prisma.admin.findFirst({
      where: { user_id: userId }
    });

    if (!adminRecord && !user.isMainAdmin) {
      return res.status(403).json({
        error: "Admin record not found. Contact system administrator."
      });
    }

    // Add admin info to request for later use
    req.admin = {
      admin_id: adminRecord?.admin_id || null,
      isMainAdmin: user.isMainAdmin,
    };

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      error: "Internal server error during authorization."
    });
  }
  next();
};

export default adminOnly;