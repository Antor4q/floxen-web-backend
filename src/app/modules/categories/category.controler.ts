/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes'
import { catchAsync } from '../../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'
import { CategoryService } from './category.service'
import { sendResponse } from '../../utils/sendResponse'
import { JwtPayload } from 'jsonwebtoken'


const createCategory = catchAsync(async(req:Request,res: Response, next: NextFunction)=> {
  const category = await CategoryService.createCategory(req.body)
  sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Category created successfully",
        data:category
    })
})
const getAllCategory = catchAsync(async(req:Request,res: Response, next: NextFunction)=> {
  const categories = await CategoryService.getAllCategory()
  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Categories retrived successfully",
        data:categories
    })
})
const getSingleCategory = catchAsync(async(req:Request,res: Response, next: NextFunction)=> {
    const id = req.params.id
  const category = await CategoryService.getSingleCategory(id as string)
  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category retrieved successfully",
        data:category
    })
})
const updateCategory = catchAsync(async(req:Request,res: Response, next: NextFunction)=> {
    const id = req.params.id as string
    const payload = req.body
    const decodedToken = req.user
  const category = await CategoryService.updateCategory(id, payload, decodedToken as JwtPayload)
  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category updated successfully",
        data:category
    })
})
const deleteCategory = catchAsync(async(req:Request,res: Response, next: NextFunction)=> {
    const id = req.params.id as string
    const decodedToken = req.user
  const category = await CategoryService.deleteCategory(id, decodedToken as JwtPayload)
  sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category deleted successfully",
        data:category
    })
})

export const CategoriesController = {
 createCategory,
 getAllCategory,
 getSingleCategory,
 updateCategory,
 deleteCategory
}