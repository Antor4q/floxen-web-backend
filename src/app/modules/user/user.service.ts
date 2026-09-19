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

// const updateUser = async(userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
//    const isUserExist = await User.findById(userId)

//    if(!isUserExist){
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
// }

//  if(payload.role){
//     if(payload.role === Role.USER || decodedToken.role === Role.USER){
//        throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
    
//    }
// if(payload.role === Role.SUPER_ADMIN || decodedToken.role === Role.ADMIN){
//        throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
    
//    }
  
//  }
   
//  if(payload.isActive || payload.isDeleted){
//     throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
//  }



//  const updateUser = await User.findByIdAndUpdate(userId, payload, {new: true,runValidators:true})
//  return updateUser
// }


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
   
    if(decodedToken.role === Role.USER){
        if(userId !== decodedToken.userId){
            throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
        }
    }

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if(decodedToken.role === Role.ADMIN || ifUserExist.role === Role.SUPER_ADMIN){
        throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
    }

  
    /**
     * email - can not update
     * name, phone, password address
     * password - re hashing
     *  only admin superadmin - role, isDeleted...
     * 
     * promoting to superadmin - superadmin
     */

    if(payload.role){
        if(decodedToken.role === Role.USER){
            throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
        }
        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
            throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
            
        }
    }
    
    if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(decodedToken.role === Role.USER){
            throw new AppError(httpStatus.BAD_REQUEST, "You're not authorized")
            
        }
    }
    
    if(payload.email){
        throw new AppError(httpStatus.BAD_REQUEST, "Email cannot be change")

    }
    if(payload.password){
        throw new AppError(httpStatus.BAD_REQUEST, "Password cannot be updated here")

    }


    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

export const userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMe,
    updateUser
}