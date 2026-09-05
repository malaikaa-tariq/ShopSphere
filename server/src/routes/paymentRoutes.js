import { Router } from "express";

import {
  createCheckoutSession,
} from "../controllers/paymentController.js";

import {
  authorize,
  protect,
} from "../middleware/auth.js";

const router = Router();

router.post(
  "/checkout",
  protect,
  authorize("buyer"),
  createCheckoutSession
);

export default router;