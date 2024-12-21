import { Router } from "express";
import { authenticateUserJWT } from "../middlewares/authMiddleware";
import * as resourceController from "../controllers/resourceController";

const router = Router();

// ================================
//           GET ROUTES
// ================================

// Returns all resources
router.get("/", authenticateUserJWT, resourceController.getAllResources);

export default router;
