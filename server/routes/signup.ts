import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { User } from "@prisma/client";
import prisma from "../../lib/prisma";
import { Request, Response, Router } from "express";

const router = Router();

router.post("/api/users/signup", async (req: Request, res: Response) => {
  const salt = bcyrpt.genSaltSync();
  const { username, email, password } = req.body;

  let user: User;
  try {
    user = await prisma.user.create({
      data: {
        username,
        email,
        password: bcyrpt.hashSync(password, salt),
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "User already exists" });
  }

  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    process.env.JWT_SECRET!,
    { expiresIn: "8h" }
  );

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("MERN_ACESS_TOKEN", token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  );

  res.status(201).json({ data: user });
});

export { router as signupRouter };
