import { Router } from "express";
import { authenticateUserJWT } from "../middlewares/authMiddleware";
import * as positionController from "../controllers/positionController";

const router = Router();

// ================================
//           GET ROUTES
// ================================

// Returns all positions
router.get("/", authenticateUserJWT, positionController.getAllPositions);

export default router;
