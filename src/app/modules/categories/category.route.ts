import { Router } from "express";
import { checkAuth } from "../../middleWars/checkAuth";
import { Role } from "../user/user.interface";
import { CategoriesController } from "./category.controler";
import { validateRequest } from "../../utils/validatedRequest";
import { createCategoryValidationSchema, updateCategoryValidationSchema } from "./category.validation";

const router = Router()

router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),validateRequest(createCategoryValidationSchema),CategoriesController.createCategory)
router.get("/all-category", CategoriesController.getAllCategory)
router.get("/single-category/:id", CategoriesController.getSingleCategory)
router.patch("/category-up/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateCategoryValidationSchema), CategoriesController.updateCategory)
router.delete("/category-del/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CategoriesController.deleteCategory)

export const CategorRouts = router