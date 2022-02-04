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

  req.session = {
    jwt: token,
  };

  res.status(201).json({ data: user });
});

export { router as signupRouter };
