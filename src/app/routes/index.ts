import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DesignRoutes } from "../modules/design/design.route";
import { CategorRouts } from "../modules/categories/category.route";

export const router = Router();

const routes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/design",
        route: DesignRoutes
    },
    {
        path: "/category",
        route: CategorRouts
    }
]

routes.forEach((route)=> {
    router.use(route.path, route.route)
})