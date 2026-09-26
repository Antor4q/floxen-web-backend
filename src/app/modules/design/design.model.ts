import { Schema, model } from "mongoose";
import { IDesign, DesignStatus, DesignType } from "./design.interface";

const designSchema = new Schema<IDesign>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(DesignType),
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    technologies: {
      type: [String],
      default: [],
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    previewVideo: {
      type: String,
      required: true,
      trim: true,
    },

    sourceFile: {
      type: String,
      required: true,
      trim: true,
    },

    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(DesignStatus),
      default: DesignStatus.DRAFT,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
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