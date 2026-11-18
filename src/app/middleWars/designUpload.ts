import os from "os";
import multer from "multer";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/appError";

const ALLOWED: Record<string, string[]> = {
  previewVideo: ["video/mp4", "video/webm"],
  thumbnail: ["image/jpeg", "image/png", "image/webp"],
  sourceFile: ["application/zip", "application/x-zip-compressed"],
};

export const designUpload = multer({
  dest: os.tmpdir(), // disk e, RAM e na
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED[file.fieldname]?.includes(file.mimetype)) {
      return cb(
        new AppError(httpStatus.BAD_REQUEST, `Invalid file type for ${file.fieldname}`)
      );
    }
    cb(null, true);
  },
}).fields([
  { name: "previewVideo", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "sourceFile", maxCount: 1 },
]);