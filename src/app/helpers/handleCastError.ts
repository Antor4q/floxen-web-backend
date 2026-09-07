import mongoose from "mongoose"
import { TGenericErrResponse } from "../interfaces/error.interface"

export const handleCastError = (err: mongoose.Error.CastError): TGenericErrResponse => {
  console.log(err)
  return {
    statusCode : 400,
    message: "Invalid ObjectId"
  }
}