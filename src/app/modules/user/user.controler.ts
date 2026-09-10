/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync( async(req: Request, res: Response) => {
    const user = await userService.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data:user
    })
})
const getAllUsers = catchAsync( async(req: Request, res: Response) => {
    const users = await userService.getAllUsers()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrived successfully",
        data:users
    })
})
const getMe = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const decodedToken = req.user as JwtPayload;
    console.log(decodedToken)
    const result = await userService.getMe(decodedToken.userId);
  
    sendResponse(res, {
        success: false,
        statusCode: httpStatus.OK,
        message: "All Users Retrieved Successfully",
        data: result.data,
        // meta: {}
    })
})
const getSingleUser = catchAsync( async(req: Request, res: Response) => {
    const slug = req.params.slug
    const user = await userService.getSingleUser(slug as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Userd retrived successfully",
        data:user
    })
})


export const UserControllers = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMe
}