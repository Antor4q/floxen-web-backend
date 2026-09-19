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
        if (!email) {
  console.log("❌ Email not found");
  return done(null, false, { message: "Email not found" });
}

let isUserExist = await User.findOne({ email });

console.log("Google email:", email);
console.log("Existing user:", isUserExist);

if (isUserExist && isUserExist.isVerified === false) {
  console.log("❌ User not verified");
  return done(null, false, { message: "User is not verified" });
}

if (
  isUserExist &&
  (
    isUserExist.isActive === IsActive.INACTIVE ||
    isUserExist.isActive === IsActive.BLOCKED
  )
) {
  console.log("❌ User inactive/blocked:", isUserExist.isActive);
  return done(null, false, {
    message: `User is ${isUserExist.isActive}`,
  });
}

if (isUserExist && isUserExist.isDeleted === true) {
  console.log("❌ User deleted");
  return done(null, false, {
    message: "User is deleted",
  });
}

        if(!isUserExist){
            isUserExist = await User.create({
                name: profile.displayName,
                email,
                role: Role.USER,
                picture: profile.photos?.[0].value,
                isVerified: true,
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
          console.log("❌ Google strategy error:", error);
        return done(error, false);
      }
    }
    )
)

console.log("GOOGLE STRATEGY REGISTERED");


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