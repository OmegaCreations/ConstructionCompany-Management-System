import { Router } from "express";
import { userLogin, createUser } from "../controllers/authController";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import { CompanyRoles } from "../utils/appTypes";

const router = Router();

// login endpoint
router.post("/login", userLogin);

// the idea is: only manager can create new workers who will change their password later.
// Whole system administrator can create first manager of the company.
router.post(
  "/create",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  createUser
);

export default router;
