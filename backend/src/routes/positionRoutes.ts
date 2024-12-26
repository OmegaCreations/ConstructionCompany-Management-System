import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import * as positionController from "../controllers/positionController";
import { CreatePositionInput } from "../utils/types";
import { CompanyRoles } from "../utils/appTypes";

const router = Router();

// ================================
//           GET ROUTES
// ================================

// Returns all positions
router.get("/", authenticateUserJWT, positionController.getAllPositions);

// ================================
//        POST ROUTES
// ================================

router.post(
  "/create",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  positionController.createPosition
);

export default router;
