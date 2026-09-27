/* eslint-disable @typescript-eslint/no-unused-vars */
import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelpers/appError"
import { ICategory } from "./category.interface"
import { Category } from "./category.model"
import httpStatus from "http-status-codes"
import { Role } from "../user/user.interface"

const createCategory = async(payload:Partial<ICategory>) => {
    const {name,...rest} = payload
    const isCategoryExist = await Category.findOne({name})
    if(isCategoryExist){
        throw new AppError(httpStatus.BAD_REQUEST, "This category already exists")
    }
 const category = await Category.create({name, ...rest})
 return category
}
const getAllCategory = async() => {
 const categories = await Category.find()
 return categories
}
const getSingleCategory = async(id:string) => {
 const category = await Category.findById({id})  
 return category
}
const updateCategory = async(id:string, payload: Partial<ICategory>, decodedToken:JwtPayload) => {
 if(decodedToken.role === Role.USER){
    throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted")
 }
 if(decodedToken.role !== Role.SUPER_ADMIN && decodedToken.role !== Role.ADMIN){
    throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted")
 }

 const isCategoryExist = await Category.findById({id})
 if(!isCategoryExist){
    throw new AppError(httpStatus.BAD_REQUEST, "This category does not exist")
 }

 if(payload.name){
    throw new AppError(httpStatus.BAD_REQUEST, "Name can't updated")
 }

 

   const updatedCate = await Category.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

 return updatedCate

}
const deleteCategory = async(id:string, decodedToken: JwtPayload) => {

    if(decodedToken.role === Role.USER){
    throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted")
 }
 if(decodedToken.role !== Role.SUPER_ADMIN && decodedToken.role !== Role.ADMIN){
    throw new AppError(httpStatus.BAD_REQUEST, "You are not permitted")
 }
  const isCategoryExist = await Category.findById(id)
 if(!isCategoryExist){
    throw new AppError(httpStatus.BAD_REQUEST, "This category does not exist")
 }

 const delCategory = await Category.findByIdAndDelete(id)
 return delCategory

}

export const CategoryService = {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
}