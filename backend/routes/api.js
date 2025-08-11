import { Router } from "express";   
import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import ProfileController from "../controllers/ProfileController.js";
import NewsController from "../controllers/NewsController.js";
import redisCache from "../DB/redis.config.js";
import TeamController from "../controllers/TeamController.js";
import ProposalController from "../controllers/ProposalController.js";


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

// Team Routes (Protected)
router.post("/teams", authMiddleware, TeamController.store);
// You can add more routes for teams (get/list/update/delete) as needed

// Proposal Routes (Protected)
router.post("/proposals/upload", authMiddleware, ProposalController.upload);
// Add more proposal routes if needed (list, update, delete, etc.)


export default router