import { Router } from "express";
import { AuthControler } from "./auth.controler";

const router = Router()

router.post("/login", AuthControler.credentialLogin )
router.post("/refresh-token", AuthControler.getNewAccessToken )
router.post("/logOut", AuthControler.logOut)


export const AuthRoutes = router;