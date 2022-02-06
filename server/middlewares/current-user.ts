import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import Cookies from "cookies";
// reach into existing type definition and modify an existing interface
//  react into express project and add additional property currentUser to the interface Request

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = new Cookies(req, res).get("token");
  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    if (!payload || typeof payload === "string") {
      return next();
    }

    req.currentUser = payload as User;
  } catch (error) {}
  next();
};
