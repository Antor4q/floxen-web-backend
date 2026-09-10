// import { Response } from "express";

import { Response } from "express";

// interface AuthTokens {
//     accessToken?: string;
//     refreshToken?: string
// }

// export const setAuthCookie = (res: Response, userTokens: AuthTokens) => {
//   if(userTokens.accessToken){
//     res.cookie("accessToken",userTokens.accessToken,{
//         httpOnly: true,
//         secure: false
//     })
//   }
//   if(userTokens.refreshToken){
//     res.cookie("refreshToken",userTokens.refreshToken,{
//         httpOnly: true,
//         secure: false
//     })
//   }
// }

interface AuthTokens {
    accessToken?: string;
    refreshToken?:string
}

export const setAuthCookie = (res: Response, userTokens: AuthTokens) => {
    if(userTokens.accessToken){
        res.cookie("accessToken", userTokens.accessToken, {
            httpOnly: true,
            secure: false
        })
    }
    if(userTokens.refreshToken){
        res.cookie("refreshToken", userTokens.refreshToken, {
            httpOnly: true,
            secure: false
        })
    }
}