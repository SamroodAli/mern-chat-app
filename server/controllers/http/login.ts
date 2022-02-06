import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import Cookies from "cookies";
import { UserModel } from "../../../models";
import { PasswordManager } from "server/services/passwordManager";

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

    const user = await UserModel.findUser(email);

    if (user && PasswordManager.comparePassword(password, user.password)) {
      const token = jwt.sign(
        {
          username: user.username,
          id: user.id,
          email: user.email,
          time: Date.now(),
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "8h",
        }
      );

      const cookies = new Cookies(req, res);

      cookies.set("token", token, {
        httpOnly: true,
      });

      res.status(200).json({ content: user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
);

export { router as loginRouter };
