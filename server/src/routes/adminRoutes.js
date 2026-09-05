import { Router } from "express";

import {
  listUsers,
  overview,
} from "../controllers/adminController.js";

import {
  authorize,
  protect,
} from "../middleware/auth.js";

const router = Router();

router.use(
  protect,
  authorize("admin")
);

router.get("/overview", overview);
router.get("/users", listUsers);

export default router;