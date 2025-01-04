import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import * as resourceController from "../controllers/resourceController";
import { CompanyRoles } from "../utils/appTypes";

const router = Router();

// ================================
//           GET ROUTES
// ================================

// Returns all resources
router.get("/", authenticateUserJWT, resourceController.getAllResources);

// ================================
//        POST ROUTES
// ================================

router.post(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  resourceController.createResource
);

// ================================
//         DELETE ROUTES
// ================================

router.delete(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  resourceController.deleteResource
);

export default router;
