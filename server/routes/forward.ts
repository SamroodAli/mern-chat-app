import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { prisma } from "../../prisma";

interface body {
  messages: string[];
  users: string[];
  sender: string;
}

const router = Router();
router.post(
  "/api/messages/forward",
  [
    body("messages").isArray(),
    body("users").isArray(),
    body("sender").isString(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { messages, users, sender }: body = req.body;

    try {
      const usersToForward = await prisma.user.findMany({
        where: {
          id: {
            in: users,
          },
        },
      });
      const promises = usersToForward.map((user) => {
        return prisma.message.createMany({
          data: messages.map((message) => ({
            content: message,
            recieverId: user.id,
            senderId: sender,
          })),
        });
      });
      await Promise.all(promises);
      res.status(200).json({ content: "success" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export { router as forwardRouter };
