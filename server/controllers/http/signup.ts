import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { body } from "express-validator";
import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import Cookies from "cookies";
import { PasswordManager } from "../../services/passwordManager";

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
    const { username, email, password } = req.body;
    const hashedPassword = PasswordManager.hashPassword(password);

    let user: User;
    try {
      user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: "User already exists" });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        id: user.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    );

    const cookies = new Cookies(req, res);

    cookies.set("token", token, {
      httpOnly: true,
    });
    res.status(201).json({ content: user });
  }
);

export { router as signupRouter };
