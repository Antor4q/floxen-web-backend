import { Types } from "mongoose";


export enum IStatus {
    DRAFTS= "DRAFTS",
    PUBLISHED="PUBLISHED",
    ARCHIVED="ARCHIVED"
}

export interface IDesign {
  title: string;
  slug: string;

  description?: string;

  category: Types.ObjectId;
  tags: string[];

  author: string;

  videoURL: string;
 
  sourceFile: string;
  prompt: string;

  isFree: boolean;

  status: IStatus;

  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}