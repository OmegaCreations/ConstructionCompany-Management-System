import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import { CompanyRoles } from "../utils/appTypes";
import * as workdayController from "../controllers/workdayController";

const router = Router();

// ================================
//           GET ROUTES
// ================================

// returns all workdays for all users in specific month
router.get(
  "/:year/:month",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  workdayController.getAllWorkDays
);

// returns all workdays for specific user in specific month
router.get(
  "/:id/:year/:month",
  authenticateUserJWT,
  workdayController.getWorkDays
);

// returns one workday data for specific user in specific date
router.get(
  "/:id/:year/:month/:day",
  authenticateUserJWT,
  workdayController.getSpecificWorkDay
);

export default router;
