import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import { CompanyRoles } from "../utils/appTypes";
import * as userController from "../controllers/userController";

const router = Router();

// ================================
//        GET ROUTES
// ================================

// get all user's data
router.get(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  userController.getAllUsers
);
// get specific user's data
router.get("/:id", authenticateUserJWT, userController.getUser);
// get user's paycheck data
router.get(
  "/:id/paycheck",
  authenticateUserJWT,
  userController.getUserPaycheck
);

// ================================
//        POST ROUTES
// ================================

// the idea is: only manager can create new workers who will change their password later.
// Whole system administrator can create first manager of the company.
router.post(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  userController.createUser
);

// ================================
//        PUT ROUTES
// ================================

// update user's data
router.put(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  userController.updateUser
);

// ================================
//         DELETE ROUTES
// ================================

router.delete(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  userController.deleteUser
);

export default router;
