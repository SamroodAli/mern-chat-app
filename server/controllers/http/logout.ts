import { Request, Response, Router } from "express";
import Cookies from "cookies";

const router = Router();
router.post("/api/users/logout", async (req: Request, res: Response) => {
  const cookies = new Cookies(req, res);

  cookies.set("token");

  res.status(200).json({ content: "Signed out successfully" });
});

export { router as logoutRouter };
