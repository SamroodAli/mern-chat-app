import { User } from "@prisma/client";
import Cookies from "cookies";
import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
// import Cookies from "cookies";

export const validateToken = (token?: string) => {
  if (!token) {
    return;
  }
  const user = jwt.verify(token, process.env.JWT_SECRET!) as User;
  return user;
};

export const getUser = ({ req, res }: GetServerSidePropsContext) => {
  const token = new Cookies(req, res).get("token");
  if (!token) {
    return;
  }

  const user = validateToken(token);
  return user;
};
