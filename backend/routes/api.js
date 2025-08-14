import { Router } from "express";   

import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import adminOnly from "../middleware/adminOnly.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";
import ReviewerController from "../controllers/admin/ReviewerController.js";
import redisCache from "../DB/redis.config.js";
import TeamController from "../controllers/teacher/TeamController.js";
import ProposalController from "../controllers/teacher/ProposalController.js";
import AssignmentController from "../controllers/admin/AssignmentController.js";
import getAllProposals from "../controllers/admin/AdminProposalController.js";

const router = Router()

// Auth Routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/verify/:token", AuthController.verifyEmail);
router.get("/auth/verify-email", AuthController.verifyEmail);
router.post("/auth/switch-role", authMiddleware, AuthController.switchRole);

// Profile Routes
router.get("/profile", authMiddleware, ProfileController.index);
router.put("/profile/:id", authMiddleware, ProfileController.update);

// News Routes
router.get("/news", redisCache.route(), NewsController.index);
router.post("/news", authMiddleware, NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);

// Team Routes
router.post("/teams", authMiddleware, TeamController.store);
router.get("/members", authMiddleware, TeamController.listMembers);
router.get("/me/context", authMiddleware, TeamController.creatorContext);

// Proposal Routes
router.post("/proposals/upload", authMiddleware, ProposalController.upload);

// Reviewer Routes (Admin functionality)
router.get("/reviewers", authMiddleware, ReviewerController.index);
router.get("/reviewers/potential", authMiddleware, ReviewerController.getPotentialReviewers);
router.post("/reviewers/invite", authMiddleware, ReviewerController.sendInvitations);
router.post("/reviewers/add", authMiddleware, ReviewerController.addReviewer);
router.put("/reviewers/:id", authMiddleware, ReviewerController.update);
router.delete("/reviewers/:id", authMiddleware, ReviewerController.removeReviewer);
router.get("/reviewers/:id/workload", authMiddleware, ReviewerController.getWorkloadDetails);

//! Assignment Routes (Admin only)
router.get(
  "/assignments/waiting", 
  authMiddleware, 
  adminOnly, 
  //redisCache.route(), 
  AssignmentController.getWaitingAssignments
);
 // Get papers/proposals waiting for assignment

router.get(
  "/assignments/reviewers",
  authMiddleware,
  AssignmentController.getAvailableReviewers
); // Get available reviewers

router.post(
  "/assignments/assign",
  authMiddleware,
  adminOnly,
  AssignmentController.assignReviewers
); // Assign reviewers to papers/proposals

router.post(
  "/assignments/auto-match",
  authMiddleware,
  AssignmentController.autoMatchReviewers
); // Auto-match reviewers

// ====================== Admin Proposals Routes ======================
router.get(
  "/admin/proposals",
  authMiddleware,
  adminOnly,
  getAllProposals
);

export default router;