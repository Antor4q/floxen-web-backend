import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { setAuthCookie } from "../../utils/setAuthCookie";
import AppError from "../../errorHelpers/appError";


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

export const AuthControler = {
    credentialLogin,
    getNewAccessToken
}