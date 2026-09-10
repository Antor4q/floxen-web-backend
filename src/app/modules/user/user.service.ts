import { JwtPayload } from "jsonwebtoken";
import { envConfig } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs"
import httpStatus from "http-status-codes"

const createUser = async(payload: Partial<IUser>) => {
    const {email, password, ...rest} = payload
 const isUserExist = await User.findOne({email:email})

 if(isUserExist){
    throw new AppError( 400, "User already exist")
 }
const hashedPassword = await bcrypt.hash(password as string, Number(envConfig.BCRYPT_SALT_ROUND))
const authProvider:IAuthProvider = {provider: "credentials", providerId: email as string}

const user = await User.create({
    email,
    password: hashedPassword,
    role: Role.USER,
    auths: [authProvider],
    ...rest
})
return user

}


const getAllUsers = async() => {
    const users = await User.find()
    return users
}

const getSingleUser = async(slug: string) => {
    const user = await User.findOne({slug}).select("-pasword")
    return user
}

const getMe = async (userId:string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user
  };
};

const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
   const isUserExist = await User.findById(userId)

   if(!isUserExist){
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
}

 if(payload.role){
    if(payload.role === Role.USER || decodedToken.role === Role.USER){
       throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
    
   }
if(payload.role === Role.ADMIN || decodedToken.role === Role.SUPER_ADMIN){
       throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
    
   }
 }
   
 if(payload.isActive || payload.isDeleted){
    throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
 }

 const updateUser = await User.findByIdAndUpdate(userId, payload, {new: true,runValidators:true})
 return updateUser
}

export const userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateUser
}