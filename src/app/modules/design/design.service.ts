import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import cloudinary from "../../config/cloudinary.config";
import {
  AssetKind,
  deleteFromCloudinary,
  removeTempFiles,
  uploadToCloudinary,
} from "../../utils/cloudinaryUpload";
import { DesignStatus, IDesign, IFileAsset } from "./design.interface";
import { Design } from "./design.model";
import { User } from "../user/user.model";

type UploadedFiles = Record<string, Express.Multer.File[]> | undefined;

type FileField = "previewVideo" | "thumbnail" | "sourceFile";

const FILE_FIELDS: { field: FileField; kind: AssetKind }[] = [
  { field: "previewVideo", kind: "video" },
  { field: "thumbnail", kind: "image" },
  { field: "sourceFile", kind: "source" },
];

const flattenFiles = (files: UploadedFiles) =>
  Object.values(files ?? {}).flat() as Express.Multer.File[];

// ------------------------------------------------------------------
// CREATE
// ------------------------------------------------------------------
const createDesign = async (
  payload: Partial<IDesign>,
  files: UploadedFiles,
  decodedToken: JwtPayload
) => {
  const uploaded: { asset: IFileAsset; kind: AssetKind }[] = [];

  try {
    // 1. Shob file ache kina check kore, file gulo tule nao
    const filesToUpload = FILE_FIELDS.map(({ field, kind }) => {
      const file = files?.[field]?.[0];

      if (!file) {
        throw new AppError(httpStatus.BAD_REQUEST, `${field} file lagbe`);
      }

      return { field, kind, file };
    });

    // 2. Cloudinary te upload
    const assets: Partial<Record<FileField, IFileAsset>> = {};

    for (const { field, kind, file } of filesToUpload) {
      const asset = await uploadToCloudinary(file, kind);
      uploaded.push({ asset, kind });
      assets[field] = asset;
    }

    // slug model er pre("validate") hook e generate hobe
    return await Design.create({
      ...payload,
      ...assets,
      author: decodedToken.userId,
    });
  } catch (error) {
    // DB create fail hole Cloudinary te orphan file thakbe na
    await Promise.all(uploaded.map((u) => deleteFromCloudinary(u.asset, u.kind)));
    throw error;
  } finally {
    await removeTempFiles(flattenFiles(files));
  }
};

// ------------------------------------------------------------------
// GET ALL (public: shudhu PUBLISHED, prompt/source chhara)
// ------------------------------------------------------------------
const getAllDesign = async (query: Record<string, unknown>) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Number(query.limit) || 12, 50);

  const filter: Record<string, unknown> = { status: DesignStatus.PUBLISHED };
  if (query.category) filter.category = query.category;
  if (query.search) {
    // regex special char escape, nahole user input diye regex break/ReDoS hote pare
    const safe = String(query.search)
      .slice(0, 100)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.title = { $regex: safe, $options: "i" };
  }

  const [designs, total] = await Promise.all([
    Design.find(filter)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Design.countDocuments(filter),
  ]);

  return {
    designs,
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
  };
};

// ------------------------------------------------------------------
// GET SINGLE (modal: prompt shoho, sourceFile chhara)
// ------------------------------------------------------------------
const getSingleDesign = async (slug: string) => {
  const design = await Design.findOneAndUpdate(
    { slug, status: DesignStatus.PUBLISHED },
    { $inc: { views: 1 } },
    { new: true }
  )
    .select("+prompt") // sourceFile kokhono expose korbo na
    .populate("author", "name avatar");

  if (!design) {
    throw new AppError(httpStatus.NOT_FOUND, "This design does not exist");
  }

  // TODO: premium gating lagle isFree false hole prompt hide koro
  return design;
};

// ------------------------------------------------------------------
// UPDATE (text field + optional file replace)
// ------------------------------------------------------------------
const updateDesign = async (
  id: string,
  payload: Partial<IDesign>,
  files: UploadedFiles
) => {
  const design = await Design.findById(id).select("+sourceFile");
  if (!design) {
    throw new AppError(httpStatus.NOT_FOUND, "This design does not exist");
  }

  const hasFiles = flattenFiles(files).length > 0;
  if (!hasFiles && Object.keys(payload).length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Update korar moto kichu pathano hoy nai");
  }

  const newUploads: { asset: IFileAsset; kind: AssetKind }[] = [];
  const oldAssets: { asset: IFileAsset; kind: AssetKind }[] = [];
  const updateData: Record<string, unknown> = { ...payload };

  try {
    for (const { field, kind } of FILE_FIELDS) {
      const file = files?.[field]?.[0];
      if (!file) continue;

      const asset = await uploadToCloudinary(file, kind);
      newUploads.push({ asset, kind });
      oldAssets.push({ asset: design[field] as IFileAsset, kind });
      updateData[field] = asset;
    }

    const updated = await Design.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // DB update success hole tobei purano file delete
    await Promise.all(oldAssets.map((o) => deleteFromCloudinary(o.asset, o.kind)));

    return updated;
  } catch (error) {
    await Promise.all(newUploads.map((u) => deleteFromCloudinary(u.asset, u.kind)));
    throw error;
  } finally {
    await removeTempFiles(flattenFiles(files));
  }
};

// ------------------------------------------------------------------
// DELETE
// ------------------------------------------------------------------
const deleteDesign = async (id: string) => {
  const design = await Design.findById(id).select("+sourceFile");
  if (!design) {
    throw new AppError(httpStatus.NOT_FOUND, "This design does not exist");
  }

  await Design.findByIdAndDelete(id);

  // DB theke gele tarpor Cloudinary cleanup
  await Promise.all(
    FILE_FIELDS.map(({ field, kind }) =>
      deleteFromCloudinary(design[field] as IFileAsset, kind)
    )
  );

  return null;
};

// ------------------------------------------------------------------
// DOWNLOAD (access check + signed, expiring link)
// ------------------------------------------------------------------
const downloadDesign = async (slug: string, decodedToken: JwtPayload) => {
  const design = await Design.findOne({
    slug,
    status: DesignStatus.PUBLISHED,
  }).select("+sourceFile");

  if (!design) {
    throw new AppError(httpStatus.NOT_FOUND, "This design does not exist");
  }

  if (!design.isFree) {
    const user = await User.findById(decodedToken.userId);
    if (user?.plan !== "PREMIUM") {
      throw new AppError(httpStatus.FORBIDDEN, "Premium plan lagbe");
    }
  }

  const url = cloudinary.utils.private_download_url(design.sourceFile.key, "", {
    resource_type: "raw",
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + 60, // 60 second valid
  });

  await Design.updateOne({ _id: design._id }, { $inc: { downloadsCount: 1 } });

  return { url };
};

export const DesignServices = {
  createDesign,
  getAllDesign,
  getSingleDesign,
  updateDesign,
  deleteDesign,
  downloadDesign,
};