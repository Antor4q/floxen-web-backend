import { Request, Response } from "express";
import httpStatus from "http-status-codes"

const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        statusCode: httpStatus.NOT_FOUND,
        message: "Route not found"
    });

}

export default notFound;

// seed super admin
/*
first check super admin exists or not, if exists then throw error, if not then create super admin,
option - 1: password must be hashed,
option - 2: use interfaces
**/ 
/*
send response utility function: --

option - 1: make tMeta and trespones interface,
option - 2: use interfaces
**/ 