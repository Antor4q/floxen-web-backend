import { NextFunction, Request, Response, Router } from "express";
import { AuthControler } from "./auth.controler";
import passport from "passport";
import { envConfig } from "../../config/env";
import { checkAuth } from "../../middleWars/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/login", AuthControler.credentialLogin )
router.post("/refresh-token", AuthControler.getNewAccessToken )
router.post("/logOut", AuthControler.logOut)
router.post("/change-password",checkAuth(...Object.values(Role)), AuthControler.changePassword)
router.post("/set-password",checkAuth(...Object.values(Role)), AuthControler.setPassword)
router.post("/forgot-password",checkAuth(...Object.values(Role)), AuthControler.forgotPassword)
router.post("/reset-password",checkAuth(...Object.values(Role)), AuthControler.resetPassword)
router.get("/google", async(req: Request, res: Response,next: NextFunction)=> {

    const redirect = req.params.redirect || "/"
    passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req,res,next)}
)
router.get("/google/callback", passport.authenticate("google",{failureRedirect: `${envConfig.FRONTEND_URL}/login?error=There is something wrong. Please contact with our support team`}), AuthControler.googleCallBack)


export const AuthRoutes = router;