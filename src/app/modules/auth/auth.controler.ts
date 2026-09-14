/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { setAuthCookie } from "../../utils/setAuthCookie";
import AppError from "../../errorHelpers/appError";
import { createUserTokens } from "../../utils/userToken";
import { envConfig } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";


const credentialLogin = catchAsync(async(req: Request, res: Response)=> {
    const payload = req.body
   
    const loginInfo = await AuthService.credentialLogin(payload)
    setAuthCookie(res,{
        "accessToken": loginInfo.accessToken,
        "refreshToken": loginInfo.refreshToken
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Your'e logged in successfully",
        data: loginInfo
    })

})


const getNewAccessToken = catchAsync(async(req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, "Token not recieved")
    }

    const tokenInfo = await AuthService.getNewAccessToken

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New Access Token Recieved",
        data: tokenInfo
    })
})

const logOut = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        
    })

     sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "You're log out successfully",
        data: null
    })
})
const googleCallBack = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
   let redirectUrl = ""

   if(typeof req.query.state === "string"){
     redirectUrl = req.query.state
     if(redirectUrl.startsWith("/")){
        redirectUrl = redirectUrl.slice(1)
     }
   }

   const user = req.user
   if(!user){
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn not exist")
   }

   const tokenInfo = createUserTokens(user)
   setAuthCookie(res, tokenInfo)

   res.redirect (`${envConfig.FRONTEND_URL}/${redirectUrl}`)
})
const changePassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
//   
 const {newPassword, oldPassword} = req.body
 const decodedToken = req.user
 await AuthService.changePassword(oldPassword,newPassword, decodedToken as JwtPayload)
  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Your password changed successfully",
        data: null
    })
 
})
const setPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
//    
})
const forgotPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
//   
})
const resetPassword = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
//   
})

export const AuthControler = {
    credentialLogin,
    getNewAccessToken,
    logOut,
    googleCallBack,
    resetPassword,
    forgotPassword,
    changePassword,
    setPassword
}