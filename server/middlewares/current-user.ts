import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
// reach into existing type definition and modify an existing interface
//  react into express project and add additional property currentUser to the interface Request

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export const currentUser = (req: Request, _: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as User;
    req.currentUser = payload;
  } catch (error) {}
  next();
};
