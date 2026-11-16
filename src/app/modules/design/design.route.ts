import { Router } from "express";
import { checkAuth } from "../../middleWars/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validatedRequest";
import { createDesignValidationSchema } from "./design.validation";
import { DesignControler } from "./design.controler";
import { updateCategoryValidationSchema } from "../categories/category.validation";

const router = Router()

router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createDesignValidationSchema), DesignControler.createDesign)
router.get("/all-design", DesignControler.getAllDesign)
router.get("/single-design/:id", DesignControler.getSingleDesign)
router.patch("/update-design/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateCategoryValidationSchema), DesignControler.updateDesign)
router.delete("/delete-design/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DesignControler.deleteDesign)

export const DesignRoutes = router