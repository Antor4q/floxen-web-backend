import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DesignServices } from "./design.service";

type UploadedFiles = Record<string, Express.Multer.File[]> | undefined;

const createDesign = catchAsync(async (req: Request, res: Response) => {
  const design = await DesignServices.createDesign(
    req.body,
    req.files as UploadedFiles,
    req.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Design created successfully",
    data: design,
  });
});

const getAllDesign = catchAsync(async (req: Request, res: Response) => {
  const result = await DesignServices.getAllDesign(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Designs retrieved successfully",
    data: result.designs,
    meta: result.meta, // sendResponse e meta support na thakle add koro
  });
});

const getSingleDesign = catchAsync(async (req: Request, res: Response) => {
  const design = await DesignServices.getSingleDesign(req.params.slug as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Design retrieved successfully",
    data: design,
  });
});

const updateDesign = catchAsync(async (req: Request, res: Response) => {
  const design = await DesignServices.updateDesign(
    req.params.id as string,
    req.body,
    req.files as UploadedFiles
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Design updated successfully",
    data: design,
  });
});

const deleteDesign = catchAsync(async (req: Request, res: Response) => {
  await DesignServices.deleteDesign(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Design deleted successfully",
    data: null,
  });
});

const downloadDesign = catchAsync(async (req: Request, res: Response) => {
  const result = await DesignServices.downloadDesign(
    req.params.slug as string,
    req.user as JwtPayload
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Download link generated",
    data: result,
  });
});

export const DesignControler = {
  createDesign,
  getAllDesign,
  getSingleDesign,
  updateDesign,
  deleteDesign,
  downloadDesign,
};