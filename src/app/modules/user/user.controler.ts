import { Request, Response } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync( async(req: Request, res: Response) => {
    const user = await userService.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data:user
    })
})

export const userController = {
    createUser
}