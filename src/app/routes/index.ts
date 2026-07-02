import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const routes = [
    {
        path: "/user",
        route: UserRoutes
    }
]

routes.forEach((route)=> {
    router.use(route.path, route.route)
})