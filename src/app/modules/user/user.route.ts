import { Request, Response, Router } from "express";

const router = Router();

router.post("/register", (req: Request, res: Response)=> {
    console.log(req.body, "register route")
    res.status(201).json({
        message: "User registered successfully"
    })
})

export const UserRoutes = router;