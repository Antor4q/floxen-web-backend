import { TErrorSources, TGenericErrResponse } from "../interfaces/error.interface"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleValidationError = (err: any): TGenericErrResponse => {
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