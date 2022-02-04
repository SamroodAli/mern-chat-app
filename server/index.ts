import next, { NextApiHandler } from "next";
import app from "./express";
import socketServer from "./socketio";
import * as dotenv from "dotenv";
dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined");
}

nextApp.prepare().then(() => {
  const server = socketServer(app);

  // serve nextjs pages
  app.all("*", (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
