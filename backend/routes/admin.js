import express from "express";
import {
  getDashboardStats,
  getPendingProperties,
  reviewProperty,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/adminController.js";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", auth, authorize("admin"), getDashboardStats);
router.get(
  "/pending-properties",
  auth,
  authorize("admin"),
  getPendingProperties,
);
router.put(
  "/properties/:propertyId/review",
  auth,
  authorize("admin"),
  reviewProperty,
);
router.get("/users", auth, authorize("admin"), getAllUsers);
router.put("/users/:id/toggle", auth, authorize("admin"), toggleUserStatus);

export default router;
