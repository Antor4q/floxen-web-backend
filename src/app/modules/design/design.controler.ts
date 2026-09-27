/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { NextFunction, Request, Response } from "express"
import { DesignServices } from "./design.service"
import { sendResponse } from "../../utils/sendResponse"
import { JwtPayload } from "jsonwebtoken"

const createDesign = catchAsync(async(req:Request, res: Response, next:NextFunction) => {
  const design = await DesignServices.createDesign(req.body)
   sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Design updated successfully",
        data:design
    })
})
const getAllDesign = catchAsync(async(req:Request, res: Response, next:NextFunction) => {
  const designs = await DesignServices.getAllDesign()
   sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Desigs retrived successfully",
        data:designs
    })
})
const getSingleDesign = catchAsync(async(req:Request, res: Response, next:NextFunction) => {
    const id = req.params.id as string
  const design = await DesignServices.getSingleDesign(id)
   sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Design retrived successfully",
        data:design
    })
})
const updateDesign = catchAsync(async(req:Request, res: Response, next:NextFunction) => {
    const id = req.params.id as string
    const payload = req.body
    const decodedToken = req.user
  const design = await DesignServices.updateDesign(id, payload, decodedToken as JwtPayload)
   sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Design updated successfully",
        data:design
    })
})
const deleteDesign = catchAsync(async(req:Request, res: Response, next:NextFunction) => {
  const design = await DesignServices.deleteDesign(req.body)
   sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Design deleted successfully",
        data:design
    })
})

export const DesignControler = {
  createDesign,
  getAllDesign,
  getSingleDesign,
  updateDesign,
  deleteDesign
}