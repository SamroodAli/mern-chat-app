import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { body } from "express-validator";
import prisma from "../../lib/prisma";
import { Request, Response, Router } from "express";
import { validateRequest } from "../middlewares/validate-request";
import Cookies from "cookies";

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("username").isString().withMessage("Username must be present"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
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

    const cookies = new Cookies(req, res);

    cookies.set("token", token, {
      httpOnly: true,
    });
    res.status(201).json({ data: user });
  }
);

export { router as signupRouter };
