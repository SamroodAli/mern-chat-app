import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../../lib/prisma";

const router = Router();
router.post("/api/users/login", async (req: Request, res: Response) => {
  console.log("I ran");
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
});

export { router as loginRouter };
