import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelpers/appError"
import { IDesign } from "./design.interface"
import { Design } from "./design.model"
import httpStatus from "http-status-codes"
import { Role } from "../user/user.interface"
import { Category } from "../categories/category.model"

const createDesign = async(payload: Partial<IDesign>)=> {
    const {title,...rest} = payload
    const isDesignExist = await Design.findOne({title})
    if(isDesignExist){
        throw new AppError(httpStatus.BAD_REQUEST, "This design already exists")
    }
   const design = await Design.create({title,...rest})
   return design
}
const getAllDesign = async()=> {
   
   const designs = await Design.find()
   return designs
}
const getSingleDesign = async(id: string)=> {
  
   const design = await Design.findById(id)
   return design
}
const updateDesign = async (
  id: string,
  payload: Partial<IDesign>,
  decodedToken: JwtPayload
) => {
  // Permission check
  if (
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not permitted to update this design"
    );
  }

  // Check design exists
  const isDesignExist = await Design.findById(id);

  if (!isDesignExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This design does not exist"
    );
  }

  // Check category if category is being updated
  if (payload.category) {
    const isCategoryExist = await Category.findById(payload.category);

    if (!isCategoryExist) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "This category does not exist"
      );
    }
  }

  // Prevent restricted fields from being updated
  delete payload.author;
  delete payload.views;
  delete payload.likesCount;

  // Update design
  const updatedDesign = await Design.findByIdAndUpdate(
    id,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedDesign;
};
const deleteDesign = async(payload: Partial<IDesign>)=> {
    const {title,...rest} = payload
    const isDesignExist = await Design.findOne({title})
    if(!isDesignExist){
        throw new AppError(httpStatus.BAD_REQUEST, "This design does not exists")
    }
   const design = await Design.create({title,...rest})
   return design
}

export const DesignServices = {
 createDesign,
 getAllDesign,
 getSingleDesign,
 updateDesign,
 deleteDesign
}