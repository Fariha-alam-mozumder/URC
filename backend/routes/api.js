import { Router } from "express";   
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";
import redisCache from "../DB/redis.config.js";
import TeamController from "../controllers/teacher/TeamController.js";
import ProposalController from "../controllers/teacher/ProposalController.js";
//import StudentTeamController from "../controllers/student/StudentTeamController.js";
import TeamDetails from "../controllers/teacher/TeamDetails.js";


const router = Router()

router.post("/auth/register",  AuthController.register);
router.post("/auth/login",  AuthController.login);
router.get("/auth/verify/:token", AuthController.verifyEmail);
router.get("/auth/verify-email", AuthController.verifyEmail);
router.post("/auth/switch-role", authMiddleware, AuthController.switchRole);
//router.get ("/auth/send-email",AuthController.sendTestEmail);

//! Profile Routes
router.get("/profile", authMiddleware, ProfileController.index) //private route
//! It requires authentication before accessing it to get user data
//! You must include a valid JWT token (usually in the Authorization header) to access the route.

router.put("/profile/:id", authMiddleware, ProfileController.update)


//! News Routes
router.get("/news", redisCache.route(), NewsController.index) // redisCache.route({expire:60*30}) o llikha jay  at least 30 min
router.post("/news",authMiddleware, NewsController.store)
router.get("/news/:id", NewsController.show)
router.put("/news/:id", authMiddleware, NewsController.update)
router.delete("/news/:id", authMiddleware, NewsController.destroy)

//! Teacher Routes
//! Team Routes (Protected)
router.post("/teams", authMiddleware, TeamController.store);
// You can add more routes for teams (get/list/update/delete) as needed
// Proposal Routes (Protected)
router.post("/proposals/upload", authMiddleware, ProposalController.upload);
// Add more proposal routes if needed (list, update, delete, etc.)
router.get("/members", authMiddleware, TeamController.listMembers);
router.get("/me/context", authMiddleware, TeamController.creatorContext);
router.get("/myteams", authMiddleware, TeamDetails.index)


//Student routes
// router.get("/my-teams", authMiddleware, StudentTeamController.myTeams);
// router.get("/teams/:id", authMiddleware, StudentTeamController.getTeamById);
// router.get("/teams/:id/proposals", authMiddleware, StudentTeamController.getProposalsByTeamId);



export default router