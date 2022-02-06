import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { UserModel } from "../../../models";
import { PasswordManager } from "server/services/passwordManager";
import { JWTManager } from "server/services/jwtManager";

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
      JWTManager.sendNewToken(req, res, user);

      res.status(200).json({ content: user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
);

export { router as loginRouter };
