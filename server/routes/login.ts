import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import prisma from "../../lib/prisma";

const router = Router();
router.post(
  "/api/users/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please enter a valid password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          time: Date.now(),
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "8h",
        }
      );

      req.session = {
        jwt: token,
      };

      res.status(200).json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
);

export { router as loginRouter };
