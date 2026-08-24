/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/appError";
import { TErrorSources, TGenericErrResponse } from "../interfaces/error.interface";
import mongoose from "mongoose";
import { envConfig } from "../config/env";




const handlerDuplicateError = (err: any): TGenericErrResponse => {
  const duplicate = err.message.match(/"([^"]*)"/)
  return {
    statusCode : 400,
    message: `${duplicate[1]} already exists`
  }
}
const handleCastError = (err: mongoose.Error.CastError): TGenericErrResponse => {
  console.log(err)
  return {
    statusCode : 400,
    message: "Invalid ObjectId"
  }
}
const handleZodError = (err: any): TGenericErrResponse => {
  const errorSources : TErrorSources[] = []
  err.issues.forEach((issue:any)=> {
    errorSources.push({
      path: issue.path[issue.path.length -1],
      message: issue.message
    })
  })
  
  return {
    statusCode : 400,
    message: "Zod Error",
    errorSources
  }
}
const handleValidationError = (err: any): TGenericErrResponse => {
   const errorSources : TErrorSources[] = []
   const error = Object.values(err.error)
   error.forEach((errObject:any) => {
    errorSources.push({
      path: errObject.path,
      message: errObject.message
    })
   })
  return {
    statusCode : 400,
    message: "Validation Error"
  }
}
export const globalErrorHandler = async(err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500
  let message = "Something went wrong"
  let errorSources : TErrorSources[] = []

    if(err.code === 11000){
      const simplifiedError = handlerDuplicateError(err)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
    }
    else if(err.name === "CastError"){
      const simplifiedError = handleCastError(err)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
    }
    else if(err.name === "ZodError"){
      const simplifiedError = handleZodError(err)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
      errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    else if(err.name === "ValidationError"){
      const simplifiedError = handleValidationError(err)
      statusCode = simplifiedError.statusCode
      message = simplifiedError.message
      errorSources = simplifiedError.errorSources as TErrorSources[]
    }
   else if(err instanceof AppError){
    statusCode = err.statusCode
    message = err.message
   }
   else if(err instanceof Error){
    statusCode = 500
    message = err.message
   }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envConfig.NODE_ENV === "development" ? err: null,
    stack: envConfig.NODE_ENV === "development" ? err.stack: null,
  })
}