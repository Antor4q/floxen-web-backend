
export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER"
}
export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}

export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone?:string;
    address?:string;
    picture?:string;
    isDeleted?:boolean;
    isActive?: IsActive;
    isVerified?:boolean;
    role: Role;
    auths: IAuthProvider[];

}