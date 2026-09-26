/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes'
import { catchAsync } from '../../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'
import { CategoryService } from './category.service'
import { sendResponse } from '../../utils/sendResponse'


const createCategory = catchAsync(async(req:Request,res: Response, next: NextFunction)=> {
  const category = await CategoryService.createCategory(req.body)
  sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Category created successfully",
        data:category
    })
})

export const CategoriesController = {
 createCategory
}