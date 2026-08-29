import { Router } from "express";
import { createOrder, myOrders, sellerOrders, updateOrderStatus } from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/auth.js";
const router = Router();
router.post("/", protect, authorize("buyer"), createOrder);
router.get("/mine", protect, authorize("buyer"), myOrders);
router.get("/seller", protect, authorize("seller", "admin"), sellerOrders);
router.patch("/:id/status", protect, authorize("seller", "admin"), updateOrderStatus);
export default router;
