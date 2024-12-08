import { Router } from "express";
import { getHello } from "../controllers/helloController";

const router = Router();

// definitions of all routes
router.get("/hello", getHello);

export default router;
