import { Router } from "express";
import { checkAuth } from "../../middleWars/checkAuth";
import { Role } from "../user/user.interface";
import { CategoriesController } from "./category.controler";

const router = Router()

router.post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), CategoriesController.createCategory)

export const CategorRouts = router