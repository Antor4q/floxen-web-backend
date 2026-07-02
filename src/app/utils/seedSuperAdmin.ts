/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcryptjs"
import { User } from "../modules/user/user.model"
import { envConfig } from "../config/env"

import { IAuthProvider, Role } from "../modules/user/user.interface"

export const seedSuperAdmin = async() => {
   try{
     const isSuperAdminExists = await User.findOne({email: envConfig.SUPER_ADMIN_EMAIL})

    if(isSuperAdminExists){
        console.log("Super admin already exists")
        return
    }

    const hashedPassword = await bcrypt.hash(envConfig.SUPER_ADMIN_PASSWORD, Number(envConfig.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = {
        provider: "credentials",
        providerId: envConfig.SUPER_ADMIN_EMAIL
    }


    const payload = {
        name: "Super Admin",
        email: envConfig.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        isVerified: true,
        auths: [authProvider]
    }

    const superAdmin = await User.create(payload)
    console.log("Super admin created successfully", superAdmin)
   }catch(error:any){
    console.log("Error seeding super admin", error)
   console.log(error)
   }
}