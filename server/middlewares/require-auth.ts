import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorised-error";

export const requireAuth = (req: Request, _: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};
