import { Router } from "express";

import {
  allOrders,
  createOrder,
  getMyOrder,
  myOrders,
  sellerOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  authorize,
  protect,
} from "../middleware/auth.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("buyer"),
  createOrder
);

router.get(
  "/mine",
  protect,
  authorize("buyer"),
  myOrders
);

router.get(
  "/seller",
  protect,
  authorize("seller"),
  sellerOrders
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  allOrders
);

router.get(
  "/:id",
  protect,
  authorize("buyer"),
  getMyOrder
);

router.patch(
  "/:id/status",
  protect,
  authorize("seller", "admin"),
  updateOrderStatus
);

export default router;