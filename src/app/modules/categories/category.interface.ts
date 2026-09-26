export enum IActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum IName {
  BACKGROUND = "BACKGROUND",
  SECTION = "SECTION",
  SHADER = "SHADER",
  TEMPLATES = "TEMPLATES",
  GRADIENTS = "GRADIENTS",
}

export interface ICategory {
  name: IName;
  slug?: string;
  description?: string;
  icon?: string;
  isActive?: IActive;
  createdAt?: Date;
  updatedAt?: Date;
}