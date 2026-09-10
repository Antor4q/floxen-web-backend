import { envConfig } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs"

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

export const userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    getMe
}