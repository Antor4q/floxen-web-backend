import { Schema, model } from "mongoose";
import { ICategory, IActive, IName } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      enum: Object.values(IName),
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    icon: {
      type: String,
      trim: true,
    },

    isActive: {
      type: String,
      enum: Object.values(IActive),
      default: IActive.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);


categorySchema.pre("save",async function(){
    if(this.name){
        const baseSlug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
           let slug = baseSlug;
           let count = 1;
           while(await Category.exists({slug})){
             slug = `${baseSlug}-${count++}`
           }
           this.slug = slug;
    }
})

categorySchema.pre("findOneAndUpdate", async function() {
  const category = this.getUpdate() as Partial<ICategory>
 if(category.name){
   const baseSlug =category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
   let slug = baseSlug;
   let count = 1;
   while(await Category.exists({slug})){
     slug = `${baseSlug}-${count++}`
   }
   category.slug = slug;
 }
 this.setUpdate(category)
});


export const Category = model<ICategory>("Category", categorySchema);