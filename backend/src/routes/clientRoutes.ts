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

// get client's data as a client
// passing token as search param and email address as a body parameter
router.post(
  "/public",
  clientController.getClientAsClient
)

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
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  clientController.createClient
);

// ================================
//         DELETE ROUTES
// ================================

router.delete(
  "/",
  authenticateUserJWT,
  checkAuthorizedRole(CompanyRoles.manager),
  clientController.deleteClient
);

export default router;
