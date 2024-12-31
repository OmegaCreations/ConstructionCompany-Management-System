import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticateUserJWT } from "../middlewares/authMiddleware";

const router = Router();

// login endpoint
router.post("/login", authController.userLogin);
router.post("/refresh", authController.refreshToken);

router.put(
  "/change-password",
  authenticateUserJWT,
  authController.changeUserPassword
);

export default router;
