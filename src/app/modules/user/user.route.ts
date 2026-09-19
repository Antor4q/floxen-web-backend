import {  Router } from "express";
import { validateRequest } from "../../utils/validatedRequest";
import { createUserZodSchema } from "./user.validation";

import { checkAuth } from "../../middleWars/checkAuth";
import { Role } from "./user.interface";
import { UserControllers } from "./user.controler";


const router = Router();

router.post("/create",validateRequest(createUserZodSchema), UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)
router.get("/me",checkAuth(...Object.values(Role)),UserControllers.getMe)
router.get("/:slug", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getSingleUser)
router.patch("/:id",checkAuth(...Object.values(Role)),UserControllers.updateUser)


export const UserRoutes = router;