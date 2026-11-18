import { Router } from "express";
import { checkAuth } from "../../middleWars/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validatedRequest";
import { designUpload } from "../../middleWars/designUpload";
import { DesignControler } from "./design.controler";
import { createDesignSchema, updateDesignSchema } from "./design.validation";

const router = Router();

// ---------- Admin ----------
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  designUpload, // 1. multer age (req.body.data + files)
  validateRequest(createDesignSchema), // 2. JSON parse + zod
  DesignControler.createDesign
);

router.patch(
  "/update-design/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  designUpload,
  validateRequest(updateDesignSchema),
  DesignControler.updateDesign
);

router.delete(
  "/delete-design/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DesignControler.deleteDesign
);

// ---------- Public ----------
router.get("/all-design", DesignControler.getAllDesign);
router.get("/single-design/:slug", DesignControler.getSingleDesign);

// ---------- Logged-in user ----------
// router.get(
//   "/download/:slug",
//   checkAuth(...Object.values(Role)),
//   DesignControler.downloadDesign
// );

export const DesignRoutes = router;