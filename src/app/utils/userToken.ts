import { envConfig } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = generateToken(jwtPayload, envConfig.JWT_ACCESS_SECRET, envConfig.JWT_ACCESS_EXPIRES)
    const refrshToken = generateToken(jwtPayload, envConfig.JWT_REFRESH_SECRET, envConfig.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refrshToken
    }





















































































































    
}