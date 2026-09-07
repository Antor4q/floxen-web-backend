import { TGenericErrResponse } from "../interfaces/error.interface"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handlerDuplicateError = (err: any): TGenericErrResponse => {
  const duplicate = err.message.match(/"([^"]*)"/)
  return {
    statusCode : 400,
    message: `${duplicate[1]} already exists`
  }
}