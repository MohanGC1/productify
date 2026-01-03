import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as commentController from "../controllers/commentController";

const router = Router();

// POST /api/comments/:productId - Add comment to product (protected)
router.post("/:productId", requireAuth(), commentController.createComment);

// DELETE /api/comments/:id - Delete comment (protected - owner only)
router.delete("/:id", requireAuth(), commentController.deleteComment);

export default router;
