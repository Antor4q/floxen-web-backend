import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import htttpStatus from "http-status-codes"
import { verifyToken } from "../utils/jwt";
import { envConfig } from "../config/env";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { IsActive } from "../modules/user/user.interface";



export const checkAuth = (...authRoles: string[]) =>async (req: Request, res: Response, next: NextFunction) => {
   try {
    
     const accessToken = req.cookies.accessToken
    if(!accessToken){
        throw new AppError(htttpStatus.BAD_REQUEST, "Token not recieved")
    }

    const verifiedToken = verifyToken(accessToken, envConfig.JWT_ACCESS_SECRET) as JwtPayload

      if(!verifiedToken){
        throw new AppError(htttpStatus.BAD_REQUEST, "Forbidden token not verified")
    }

    const isUserExist = await User.findOne({email: verifiedToken.email})

     if(!isUserExist){
        throw new AppError(htttpStatus.BAD_REQUEST, "User does not exist")
    }
     if(isUserExist.isActive === IsActive.INACTIVE || isUserExist.isActive === IsActive.BLOCKED){
        throw new AppError(htttpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
     if(isUserExist.isDeleted){
        throw new AppError(htttpStatus.BAD_REQUEST, `User is deleted`)
    }
    
    if(!authRoles.includes(isUserExist.role)){
        throw new AppError(htttpStatus.BAD_REQUEST, `You're not permitted`)

    }

   req.user = verifiedToken




next();

   } catch (error) {
     next(error)
   }
}