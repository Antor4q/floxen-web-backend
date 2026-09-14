import { NextFunction, Request, Response, Router } from "express";
import { AuthControler } from "./auth.controler";
import passport from "passport";
import { envConfig } from "../../config/env";

const router = Router()

router.post("/login", AuthControler.credentialLogin )
router.post("/refresh-token", AuthControler.getNewAccessToken )
router.post("/logOut", AuthControler.logOut)
router.get("/google", async(req: Request, res: Response,next: NextFunction)=> {

    const redirect = req.params.redirect || "/"
    passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req,res,next)
})
router.get("/google/callback", passport.authenticate("google",{failureRedirect: `${envConfig.FRONTEND_URL}/login?error=There is something wrong. Please contact with our support team`}), AuthControler.googleCallBack)


export const AuthRoutes = router;