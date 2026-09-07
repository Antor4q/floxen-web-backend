import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
  provider: {type: String, required: true},
  providerId: {type: String, required: true}
})
const userSchema = new Schema<IUser>({
  name: {type: String, required: true},
   slug: {type: String},
  email: {type: String, required: true, unique: true},
  password: {type: String},
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.USER
  },
  phone: {type:String},
  address: {type: String},
  picture: {type: String},
  isDeleted: {type: Boolean,default: false},
  isActive: {
    type: String,
    enum: Object.values(IsActive),
    default: IsActive.ACTIVE
  },
  isVerified: {type: Boolean, default: false},
  auths: [authProviderSchema]

})

userSchema.pre("save", async function() {
 if(this.name){
   const baseSlug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
   let slug = baseSlug;
   let count = 1;
   while(await User.exists({slug})){
     slug = `${baseSlug}-${count++}`
   }
   this.slug = slug;
 }
});
userSchema.pre("findOneAndUpdate", async function() {
  const user = this.getUpdate() as Partial<IUser>
 if(user.name){
   const baseSlug = user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
   let slug = baseSlug;
   let count = 1;
   while(await User.exists({slug})){
     slug = `${baseSlug}-${count++}`
   }
   user.slug = slug;
 }
 this.setUpdate(user)
});

export const User = model<IUser>("User", userSchema);