import { Router } from "express";
import { userLogin, changeUserPassword } from "../controllers/authController";
import { authenticateUserJWT } from "../middlewares/authMiddleware";

const router = Router();

// login endpoint
router.post("/login", userLogin);
router.put("/change-password", authenticateUserJWT, changeUserPassword);

export default router;
