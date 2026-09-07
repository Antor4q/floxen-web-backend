import { Router } from "express";
import { validateRequest } from "../../utils/validatedRequest";
import { createUserZodSchema } from "./user.validation";
import { userController } from "./user.controler";


const router = Router();

router.post("/create",validateRequest(createUserZodSchema), userController.createUser)

export const UserRoutes = router;