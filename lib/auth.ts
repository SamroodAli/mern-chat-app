import { User } from "@prisma/client";
import Cookies from "cookies";
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
// import Cookies from "cookies";

export const validateToken = (token?: string) => {
  if (!token) {
    return;
  }
  const user = jwt.verify(token, process.env.JWT_SECRET!) as User;
  return user;
};

interface Context {
  req?: IncomingMessage;
  res?: ServerResponse;
}

export const getUser = ({ req, res }: Context) => {
  if (!req || !res) {
    return;
  }

  const token = new Cookies(req, res).get("token");
  if (!token) {
    return;
  }

  const user = validateToken(token);
  return user;
};
