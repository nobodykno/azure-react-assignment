import { Router } from "express";
import controller from "../controller/index.js";

const router = Router();

router.get("/", controller.HealthController.healthCheck);

export default router;