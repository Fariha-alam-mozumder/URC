import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import adminOnly from "../middleware/adminOnly.js";
import reviewerOnly from "../middleware/reviewerOnly.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";
import ReviewerController from "../controllers/admin/ReviewerController.js";
//import redisCache from "../DB/redis.config.js";
import TeamController from "../controllers/teacher/TeamController.js";
import TeamDetails from "../controllers/teacher/TeamDetails.js";
import PaperController from "../controllers/teacher/PaperController.js";
import ProposalController from "../controllers/teacher/ProposalController.js";
import StudentTeamController from "../controllers/student/StudentTeamController.js";
import TeamApplicationController from "../controllers/teacher/TeamApplicationController.js";
import TeamCommentController from "../controllers/teacher/TeamCommentController.js";
import AssignmentController from './../controllers/admin/AssignmentController.js';
import SubmissionsController from "../controllers/teacher/SubmissionsController.js";
import AdminPaperController from "../controllers/admin/AdminPaperController.js";
import ReviewController from "../controllers/reviewer/ReviewController.js";
import ReviewerAssignedController from '../controllers/reviewer/AssignedController.js';
import DepartmentController from "../controllers/admin/DepartmentController.js"
import DashReviewerAssignedController from "../controllers/reviewer/reviewAssignController.js";
import RecentSubmissionController from "../controllers/admin/RecentSubmission.js";
import AdminTeamController from "../controllers/admin/TeamController.js";
import StatsController from "../controllers/admin/StatsController.js";
import SubmissionTrendsController from "../controllers/admin/SubmissionTrendsController.js";
import StatusDistributionController from "../controllers/admin/StatusDistributionController.js";
import ReviewerWorkloadController from "../controllers/admin/ReviewerWorkloadController.js";


const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/verify/:token", AuthController.verifyEmail);
router.get("/auth/verify-email", AuthController.verifyEmail);
router.post("/auth/switch-role", authMiddleware, AuthController.switchRole);

//! Profile Routes
router.get('/user/profile/:userId', authMiddleware, ProfileController.getUserProfile);
router.get('/user/preferences/:userId', authMiddleware, ProfileController.getUserPreferences);
router.put('/user/preferences/:userId', authMiddleware, ProfileController.updateUserPreferences);

//! Avatar upload route (separate endpoint for cleaner handling)
router.post('/user/avatar/:userId', authMiddleware, ProfileController.uploadAvatar);

//! Department domain routes
router.get('/department/:departmentId/domains', authMiddleware, ProfileController.getDomainsByDepartment);

//! Data routes (for dropdowns and selections)
router.get('/departments', authMiddleware, ProfileController.getDepartments);
router.get('/domains', authMiddleware, ProfileController.getDomains);

//! News Routes
router.get("/news", NewsController.index); // redisCache.route({expire:60*30}) o llikha jay  at least 30 min
router.post("/news", authMiddleware, NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);

//! Teacher Routes
//! Team Routes (Protected)
// Team routes (existing)
// Create a team
router.post("/teams", authMiddleware, TeamController.store);
router.get("/teacher/my-teams", authMiddleware, TeamDetails.index);
router.get("/teacher/teams/:id", authMiddleware, TeamDetails.getTeamById);

// Get all papers
router.get("/teacher/my-teams/papers", authMiddleware, TeamDetails.getAllTeamPapers);
router.get("/teacher/my-teams/proposals", authMiddleware, TeamDetails.getAllTeamProposals);
router.get("/teacher/my-teams/comments", authMiddleware, TeamDetails.getAllTeamComments);
router.get("/submissions", authMiddleware, SubmissionsController.list);
router.get("/submissions/filters", authMiddleware, SubmissionsController.filters);

// Proposal routes
router.post("/proposals/upload", authMiddleware, ProposalController.upload);
router.get("/teams/:teamId/proposals", authMiddleware, ProposalController.getTeamProposals);

// Paper routes  
router.post("/papers/upload", authMiddleware, PaperController.upload);
router.get("/teams/:teamId/papers", authMiddleware, PaperController.getTeamPapers);
// Team-facing anonymized review views
router.get(
  "/api/team/papers/:paperId/public-reviews",
  authMiddleware,
  TeamDetails.getPublicReviewsForPaper
);

router.get(
  "/api/team/proposals/:proposalId/public-reviews",
  authMiddleware,
  TeamDetails.getPublicReviewsForProposal
);

//! Member routes (existing)
router.get("/members", authMiddleware, TeamController.listMembers);
router.get("/me/context", authMiddleware, TeamController.creatorContext);

//! Team member management
router.post("/teacher/teams/:id/add-members", authMiddleware, TeamDetails.addMembersToTeam);
router.patch("/teacher/teams/:id/status", authMiddleware, TeamDetails.updateStatus);

// Team applications
router.get("/teams/:teamId/applications", authMiddleware, TeamApplicationController.getTeamApplications);
router.patch("/applications/:applicationId", authMiddleware, TeamApplicationController.updateApplicationStatus);

//! Team comments
router.get("/teams/:teamId/comments", authMiddleware, TeamCommentController.getTeamComments);
router.post("/teams/:teamId/comments", authMiddleware, TeamCommentController.createComment);

//! Paper and Proposal deletion
router.delete("/proposals/:proposalId", authMiddleware, ProposalController.deleteProposal);
router.delete("/papers/:paperId", authMiddleware, PaperController.deletePaper);

//! Student routes
router.get("/student/my-teams", authMiddleware, StudentTeamController.myTeams);
router.get("/student/teams/:id", authMiddleware, StudentTeamController.getTeamById);
router.get("/student/my-teams/papers", authMiddleware, StudentTeamController.getAllTeamPapers);
router.get("/student/my-teams/proposals", authMiddleware, StudentTeamController.getAllTeamProposals);
router.get("/student/my-teams/comments", authMiddleware, StudentTeamController.getAllTeamComments);

// router.get("/teams/:id/proposals", authMiddleware, StudentTeamController.getProposalsByTeamId);
//! Reviewer Routes (Admin functionality)
router.get("/reviewers", authMiddleware, ReviewerController.index);
router.get("/reviewers/potential", authMiddleware, ReviewerController.getPotentialReviewers);
router.post("/reviewers/invite", authMiddleware, ReviewerController.sendInvitations);
router.put("/reviewers/:id", authMiddleware, ReviewerController.update);
router.delete("/reviewers/:id", authMiddleware, ReviewerController.removeReviewer);
router.get("/reviewers/:id/workload", authMiddleware, ReviewerController.getWorkloadDetails);


//! Reviews (public read)
// router.get("/reviews/by-item/:code", authMiddleware, ReviewController.listReviewsForItemByCode);
// router.get("/reviews/:reviewId/attachment", authMiddleware, ReviewController.downloadReviewAttachment);

// Admin-only route to get all recent submissions
router.get(
  "/admin/recent-submissions",
  authMiddleware,
  adminOnly,
  RecentSubmissionController.getAllSubmissions
);

router.get(
  "/admin/teams",
  authMiddleware,
  adminOnly,
  AdminTeamController.index
);

router.get(
  "/admin/teams/:id",
  authMiddleware,
  adminOnly,
  AdminTeamController.show
);

router.get(
  "/admin/stats",
  authMiddleware,
  adminOnly,
  StatsController.getDashboardStats
);

// Admin-only route for submission trends
router.get(
  "/admin/submission-trends",
  authMiddleware,
  adminOnly,
  SubmissionTrendsController.getTrends
);

router.get(
  "/admin/status-distribution",
  authMiddleware,
  adminOnly,
  StatusDistributionController.getDistribution
);

router.get(
  "/admin/reviewer-workload",
  authMiddleware,
  adminOnly,
  ReviewerWorkloadController.getReviewerWorkload
);


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
  adminOnly,
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
// backend/routes/index.js (where your other admin routes live)
router.get(
  "/admin/departments",
  authMiddleware,
  adminOnly,
  DepartmentController.list
);

router.get(
  "/admin/proposals",
  authMiddleware,
  adminOnly,
  AdminPaperController.getAllProposals
);

router.get(
  "/admin/papers",
  authMiddleware,
  adminOnly,
  AdminPaperController.getAllPapers
);


//!reviewer Routes
router.get(
  "/reviewer/assigned-papers",
  authMiddleware,
  ReviewerAssignedController.getAssignedPapers
);

router.get(
  "/reviewer/assigned-proposals",
  authMiddleware,
  ReviewerAssignedController.getAssignedProposals
);

// Update assignment status (only reviewer who is assigned can update)
router.patch(
  "/reviewer/assignments/:id/status",
  authMiddleware,
  ReviewerAssignedController.updateAssignmentStatus
);


router.get(
  "/reviewer/review/:code",
  authMiddleware,
  reviewerOnly,
  ReviewController.getItemForReviewByCode
);

router.get(
  "/reviewer/review/:code/download",
  authMiddleware,
  reviewerOnly,
  ReviewController.downloadItemPdfByCode
);

router.post(
  "/reviewer/review/:code",
  authMiddleware,
  reviewerOnly,
  ReviewController.submitReviewByCode
);

// Reviewer assigned papers (new route)
router.get(
  "/reviewer/assigned-papers2",
  authMiddleware,
  DashReviewerAssignedController.getAssignedPapers
);




export default router;