import { Schema, model } from "mongoose";
import { IDesign, DesignStatus, DesignCategory } from "./design.interface";

const fileAssetSchema = new Schema(
  { url: String, key: String, size: Number },
  { _id: false }
);

const designSchema = new Schema<IDesign>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: String, enum: Object.values(DesignCategory), required: true, index: true },
    thumbnail: { type: fileAssetSchema, required: true },
    previewVideo: { type: fileAssetSchema, required: true },

    // list API te jate leak na hoy
    prompt: { type: String, required: true, select: false },
    sourceFile: { type: fileAssetSchema, required: true, select: false },

    tags: [String],
    technologies: [String],
    isFree: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(DesignStatus), default: DesignStatus.DRAFT, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },

    views: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    downloadsCount: { type: Number, default: 0 },
    promptCopiesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


designSchema.pre("save",async function(){
    if(this.title){
        const baseSlug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
           let slug = baseSlug;
           let count = 1;
           while(await Design.exists({slug})){
             slug = `${baseSlug}-${count++}`
           }
           this.slug = slug;
    }
})

designSchema.pre("findOneAndUpdate", async function() {
  const design = this.getUpdate() as Partial<IDesign>
 if(design.title){
   const baseSlug = design.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
   let slug = baseSlug;
   let count = 1;
   while(await Design.exists({slug})){
     slug = `${baseSlug}-${count++}`
   }
   design.slug = slug;
 }
 this.setUpdate(design)
});

export const Design = model<IDesign>("Design", designSchema);