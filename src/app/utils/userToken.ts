import { JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/appError";
import httpStatus from "http-status-codes"

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

export const createNewAccessTokenWRT =  async(refreshToken: string) => {

    const verifiedToken = verifyToken(refreshToken, envConfig.JWT_REFRESH_SECRET) as JwtPayload

   const isUserExist = await User.findOne({email: verifiedToken.email}) 

    
    if(!isUserExist){
       throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
   } 
    if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
       throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
   } 
    if(isUserExist.isDeleted){
       throw new AppError(httpStatus.BAD_REQUEST, `User is user is deleted`)
   } 

   const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role

   }

   const accessToken = generateToken(jwtPayload, envConfig.JWT_ACCESS_SECRET, envConfig.JWT_ACCESS_EXPIRES)

   return {
    accessToken
   }
}
