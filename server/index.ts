import express, { Express, Request, Response } from "express";
import * as http from "http";
import next, { NextApiHandler } from "next";
import * as socketio from "socket.io";
import morgan from "morgan";
import { json, urlencoded } from "express";

const port: number = parseInt(process.env.PORT || "3000", 10);
const dev: boolean = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app: Express = express();
  app.use(morgan("dev"));
  app.use(urlencoded({ extended: true }));
  app.use(json());

  const server: http.Server = http.createServer(app);
  const io: socketio.Server = new socketio.Server();
  io.attach(server);

  app.get("/ping", async (_: Request, res: Response) => {
    res.send(`Server running successfully at port ${port}`);
  });

  io.on("connection", (socket: socketio.Socket) => {
    console.log("connection");
    socket.emit("status", "Hello from Socket.io");

    socket.on("disconnect", () => {
      console.log("client disconnected");
    });
  });

  app.all("*", (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
