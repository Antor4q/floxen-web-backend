/* eslint-disable @typescript-eslint/no-unused-vars */

import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";
import { createNewUserTokenWRT, createUserTokens } from "../../utils/userToken";

import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envConfig } from "../../config/env";
import { sendEmail } from "../../utils/sendEmail";




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

const changePassword =async(oldPassword: string, newPassword: string, decodedToken: JwtPayload)=> {
 const user = await User.findById(decodedToken.userId)

 if(!user){
    throw new AppError(httpStatus.BAD_REQUEST, "User not found")
}

const matchPassword = await bcrypt.compare(oldPassword, user.password as string)

if(!matchPassword){
     throw new AppError(httpStatus.BAD_REQUEST, "Invalid credential, old password does not match")

 }

 user.password = await bcrypt.hash(newPassword as string, Number(envConfig.BCRYPT_SALT_ROUND))
 await user.save()
 
}
const setPassword =async(userId : string, password: string)=> {
 const user = await User.findById(userId)
  if(!user){
    throw new AppError(httpStatus.BAD_REQUEST, "User not found")
}

if(user.password && user.auths.some(providerOb => providerOb.provider === "google")) {
     throw new AppError(httpStatus.BAD_REQUEST, "You have already set password")

 }   
 
 const hashedPass = await bcrypt.hash(password, Number(envConfig.BCRYPT_SALT_ROUND))

 const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email
 }

 const auths: IAuthProvider[] = [...user.auths, credentialProvider]
 user.password = hashedPass
 user.auths = auths
 await user.save()

}
const forgotPassword = async(email: string)=> {
 const isUserExist = await User.findOne({email})
  if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
     if(isUserExist.isActive === IsActive.INACTIVE || isUserExist.isActive === IsActive.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
     if(isUserExist.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST, `User is deleted`)
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envConfig.JWT_ACCESS_SECRET, {expiresIn:"10m"})
    const resetUiLink = `${envConfig.FRONTEND_URL}/reset-password?id=${isUserExist._id}&&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password reset",
        templateName: "forgotPassword",
        templateData: {
            name: isUserExist.name,
            resetUiLink
        }
    })

}
const resetPassword = async(req: Request, res: Response, next: NextFunction)=> {
//   
}
 //  verify user => match old pass => hash new pass => save
 //  user verify => check password already set or not => hash pass => make provider => declare all provider => set pass and auth and save

export const AuthService = {
    credentialLogin,
    getNewAccessToken,
    resetPassword,
    forgotPassword,
    changePassword,
    setPassword
}