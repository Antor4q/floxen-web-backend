import fs from "fs/promises";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.config";
import { IFileAsset } from "../modules/design/design.interface";

export type AssetKind = "video" | "image" | "source";

const CONFIG = {
  video: {
    resource_type: "video",
    folder: "designs/videos",
    type: "upload",
  },
  image: {
    resource_type: "image",
    folder: "designs/thumbnails",
    type: "upload",
  },
  source: {
    resource_type: "raw",
    folder: "designs/source",
    type: "authenticated", // private
  },
} as const;

export const uploadToCloudinary = (
  file: Express.Multer.File,
  kind: AssetKind
): Promise<IFileAsset> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      file.path,
      { ...CONFIG[kind], chunk_size: 6_000_000 },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }
        resolve({
          url: result.secure_url,
          key: result.public_id,
          size: result.bytes,
        });
      }
    );
  });

export const deleteFromCloudinary = async (
  asset: IFileAsset | undefined,
  kind: AssetKind
) => {
  if (!asset?.key) return;

  const { resource_type, type } = CONFIG[kind];

  try {
    await cloudinary.uploader.destroy(asset.key, {
      resource_type,
      type,
      invalidate: true,
    });
  } catch (error) {
    console.error("Cloudinary delete failed:", asset.key, error);
  }
};

export const removeTempFiles = async (files: Express.Multer.File[]) => {
  await Promise.all(files.map((file) => fs.unlink(file.path).catch(() => {
    // 
  })));
};