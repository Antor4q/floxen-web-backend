import { Types } from "mongoose";

export enum DesignStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum DesignType {
  SECTION = "SECTION",
  COMPONENT = "COMPONENT",
  PAGE = "PAGE",
}

export interface IDesign {
  title: string;
  slug: string;
  description?: string;

  type: DesignType;

  category: Types.ObjectId;
  tags: string[];

  technologies: string[];

  author: Types.ObjectId;

  previewVideo: string;
  sourceFile: string;

  prompt: string;

  isFree: boolean;

  status: DesignStatus;

  views: number;
  likesCount: number;

  createdAt: Date;
  updatedAt: Date;
}