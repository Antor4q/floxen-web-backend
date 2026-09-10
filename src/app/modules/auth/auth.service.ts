/* eslint-disable @typescript-eslint/no-unused-vars */

import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";
import { createNewUserTokenWRT, createUserTokens } from "../../utils/userToken";

import { Response } from "express";


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

    const userTokens = createUserTokens(isUserExist)
   

    const {password:pass, ...rest} = isUserExist.toObject()


    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        ...rest
    }
}

const getNewAccessToken = async(refreshToken: string) => {
   const accessToken = createNewUserTokenWRT(refreshToken)
   return accessToken
}
export const AuthService = {
    credentialLogin,
    getNewAccessToken
}