import jwt from "jsonwebtoken";

export const validateToken = (token?: string) => {
  if (!token) {
    return;
  }
  const user = jwt.verify(token, process.env.JWT_SECRET!);
  return user;
};
