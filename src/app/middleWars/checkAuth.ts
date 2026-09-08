/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpSttaus from "http-status-codes"
import AppError from "../errorHelpers/appError";
import { User } from "../modules/user/user.model";

import { envConfig } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
    //    const accessToken = req.headers.authorization
       const accessToken = req.cookies.accessToken

    if(!accessToken){
        throw new AppError(httpSttaus.BAD_REQUEST, "Forbidden request")
    } 

    const verifiedToken = verifyToken(accessToken, envConfig.JWT_ACCESS_SECRET) as JwtPayload
     if(!verifiedToken){
        throw new AppError(httpSttaus.BAD_REQUEST, "Forbidden request")
    } 
    const isUserExist = await User.findOne({email: verifiedToken.email})
    
    if(!isUserExist){
       throw new AppError(httpSttaus.BAD_REQUEST, "User does not exist")
   } 
    if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
       throw new AppError(httpSttaus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
   } 
    if(isUserExist.isDeleted){
       throw new AppError(httpSttaus.BAD_REQUEST, `User is user is deleted`)
   } 

   if(!authRoles.includes(verifiedToken.role)){
    throw new AppError(httpSttaus.FORBIDDEN, "Your are not permited")
   }

   req.user = verifiedToken

    } catch (error:any) {
        next(error)
    }
}