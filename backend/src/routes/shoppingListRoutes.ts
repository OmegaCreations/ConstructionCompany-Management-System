import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import { CompanyRoles } from "../utils/appTypes";
import * as shoppingListController from "../controllers/shoppingListController";

const router = Router();

// ================================
//           GET ROUTES
// ================================

// Returns shopping list
router.get(
  "/:year/:month/:day",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  shoppingListController.getShoppingList
);

export default router;
