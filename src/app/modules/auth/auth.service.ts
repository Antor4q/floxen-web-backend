/* eslint-disable @typescript-eslint/no-unused-vars */

import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";


const credentialLogin = async(payload: Partial<IUser>) => {
   const {password,email} = payload;
   const isUserExist = await User.findOne({email})
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

    if(!isPasswordMatched){
        throw new AppError(httpStatus.FORBIDDEN, "Invalid credentials")
    }

    const {password:pass, ...rest} = isUserExist.toObject()

    return {
        ...rest
    }
}
export const AuthService = {
    credentialLogin
}