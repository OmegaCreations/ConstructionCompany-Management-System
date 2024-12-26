import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import { CompanyRoles } from "../utils/appTypes";
import * as clientController from "../controllers/clientController";

const router = Router();

// ================================
//        GET ROUTES
// ================================

// get all user's data
router.get(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  clientController.getAllClients
);
// get specific user's data
router.get(
  "/:id",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  clientController.getClient
);

// ================================
//        POST ROUTES
// ================================

router.post(
  "/create",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  clientController.createClient
);

export default router;
