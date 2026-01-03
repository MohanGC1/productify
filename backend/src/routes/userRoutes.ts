import { Router } from "express";
import { syncUser } from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

// /api/users/sync - POST - sync the clerk users to DB

router.post("/sync", requireAuth(), syncUser);

export default router;
