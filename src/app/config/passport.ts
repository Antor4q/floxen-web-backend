/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport"
import {Strategy as GoogleStrategy } from "passport-google-oauth20"
import { envConfig } from "./env"
import { User } from "../modules/user/user.model";
import { IsActive, Role } from "../modules/user/user.interface";


passport.use(
    new GoogleStrategy(
        {
            clientID: envConfig.GOOGLE_CLIENT_ID,
            clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
            callbackURL: envConfig.GOOGLE_CALLBACK_URL
        }, async (accessToken, refreshToken, profile, done) => {
      try {
       
        const email = profile.emails?.[0].value;
        if(!email){
            return done(null, false, {message: "Email not found"})
        }
        
        let isUserExist = await User.findOne({email})
        
        if(isUserExist && isUserExist.isVerified === false){
            return done(null, false, {message: "User is not verified"})

        }
        if(isUserExist && (isUserExist.isActive === IsActive.INACTIVE || isUserExist?.isActive === IsActive.BLOCKED)){
            return done(null, false, {message: `User is ${isUserExist.isActive}`})

        }
        if(isUserExist && isUserExist.isDeleted === true){
            return done(null, false, {message: `User is deleted`})

        }

        if(!isUserExist){
            isUserExist = await User.create({
                name: profile.displayName,
                email,
                role: Role.USER,
                picture: profile.photos?.[0].value,
                auths:[
                    {
                        provider: "google",
                        providerId: profile.id
                    }
                ]
            })
        }

        return done(null, isUserExist);
      } catch (error) {
        return done(error, false);
      }
    }
    )
)


passport.serializeUser((user:any, done:(err: any, id?: unknown)=> void) => {
  done(null, user.id);
})

passport.deserializeUser(async(id:string, done:any)=> {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error,  null)
    }
})