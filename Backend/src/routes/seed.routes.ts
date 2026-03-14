import { Router } from "express";
import { runSeedController } from "../controllers/seed.controller";

const router = Router();

router.post("/", runSeedController);

export default router;