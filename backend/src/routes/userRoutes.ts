import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import { CompanyRoles } from "../utils/appTypes";
import { createUser, getUser, updateUser } from "../controllers/userController";

const router = Router();

// get user's data
router.get("/", authenticateUserJWT, getUser);

// the idea is: only manager can create new workers who will change their password later.
// Whole system administrator can create first manager of the company.
router.post(
  "/create",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  createUser
);

// update user's data
router.put(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  updateUser
);

export default router;
