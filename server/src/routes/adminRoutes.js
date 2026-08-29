import { Router } from "express";
import { overview } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";
const router = Router();
router.get("/overview", protect, authorize("admin"), overview);
export default router;
