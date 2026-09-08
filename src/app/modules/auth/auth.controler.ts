import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"

const credentialLogin = catchAsync(async(req: Request, res: Response)=> {
    const payload = req.body
    console.log(payload)
    const loginInfo = await AuthService.credentialLogin(payload)
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