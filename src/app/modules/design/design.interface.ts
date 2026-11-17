import { Types } from "mongoose";

export enum DesignCategory {
  TEMPLATE = "TEMPLATE",
  SCENE_3D = "SCENE_3D",
  SHADER = "SHADER",
  BACKGROUND = "BACKGROUND",
}

export const CATEGORY_LABELS: Record<DesignCategory, string> = {
  TEMPLATE: "Template",
  SCENE_3D: "3D Scene",
  SHADER: "Shader",
  BACKGROUND: "Background",
};

export enum DesignStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface IFileAsset {
  url: string;
  key: string; // Cloudinary public_id
  size?: number;
}

export interface IDesign {
  title: string;
  slug: string;
  description: string;
  category: DesignCategory;
  thumbnail: IFileAsset;
  previewVideo: IFileAsset;

  prompt: string;
  sourceFile: IFileAsset;
  tags: string[];
  technologies: string[];

  isFree: boolean;
  status: DesignStatus;
  author: Types.ObjectId;

  views: number;
  likesCount: number;
  downloadsCount: number;
  promptCopiesCount: number;

  createdAt: Date;
  updatedAt: Date;
}