import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { Request, Response } from "express";

const EXPIRESIN = "8h";
if (process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export class JWTManager {
  static sendNewToken<Payload>(req: Request, res: Response, payload: Payload) {
    const token = jwt.sign(
      {
        ...payload,
        time: Date.now(),
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: EXPIRESIN,
      }
    );
    const cookies = new Cookies(req, res);

    cookies.set("token", token, {
      httpOnly: true,
    });

    return token;
  }
}
