/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/appError"
import { ICategory } from "./category.interface"
import { Category } from "./category.model"
import httpStatus from "http-status-codes"

const createCategory = async(payload:Partial<ICategory>) => {
    const {name,...rest} = payload
    const isCategoryExist = await Category.findOne({name})
    if(isCategoryExist){
        throw new AppError(httpStatus.BAD_REQUEST, "This category already exists")
    }
 const category = await Category.create({name, ...rest})
 return category
}

export const CategoryService = {
    createCategory
}