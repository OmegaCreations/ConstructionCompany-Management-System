import { Router } from "express";
import {
  authenticateUserJWT,
  checkAuthorizedRole,
} from "../middlewares/authMiddleware";
import { CompanyRoles } from "../utils/appTypes";
import * as warehouseController from "../controllers/warehouseController";

const router = Router();

// ================================
//           GET ROUTES
// ================================

// Returns all warehouses
router.get("/", authenticateUserJWT, warehouseController.getAllWarehouses);

// Returns all resources for specific warehouse with specific view depending on user role
router.get(
  "/:id/resources",
  authenticateUserJWT,
  warehouseController.getWarehouseResources
);

// ================================
//        POST ROUTES
// ================================

// creates new warehouse
router.post(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  warehouseController.createWarehouse
);

// adds resource to warehouse
router.post(
  "/resource",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  warehouseController.addResourceToWarehouse
);

export default router;
