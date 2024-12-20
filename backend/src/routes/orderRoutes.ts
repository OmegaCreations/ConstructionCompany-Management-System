import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import { CompanyRoles } from "../utils/appTypes";
import * as orderController from "../controllers/orderController";

const router = Router();

// ================================
//        GET ROUTES
// ================================

// get all orders' data
router.get("/", authenticateUserJWT, orderController.getAllOrders);

// get specific order's data
router.get("/:id", authenticateUserJWT, orderController.getOrder);

// get client's orders
router.get(
  "/client/:id",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  orderController.getClientOrders
);

// get order's costs
router.get(
  "/:id/costs",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  orderController.getOrderCosts
);

// get order's needed resources
router.get(
  "/:id/resources",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  orderController.getOrderResources
);

export default router;
