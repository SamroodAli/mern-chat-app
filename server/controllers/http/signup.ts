import { body } from "express-validator";
import { Request, Response, Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import { PasswordManager } from "../../services/passwordManager";
import { JWTManager } from "server/services/jwtManager";
import { UserModel } from "models";

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

    try {
      const user = await UserModel.createUser(username, email, hashedPassword);
      JWTManager.sendNewToken(req, res, user);
      return res.status(201).json({ content: user });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: "User already exists" });
    }
  }
);

export { router as signupRouter };
