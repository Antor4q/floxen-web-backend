import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { setAuthCookie } from "../../utils/setAuthCookie";

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


export const AuthControler = {
    credentialLogin
}