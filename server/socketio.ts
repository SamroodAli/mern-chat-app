// import { User } from "@prisma/client";
import { User } from "@prisma/client";
import * as http from "http";
import * as socketio from "socket.io";
import prisma from "../lib/prisma";

const createServer = (expressApp: http.RequestListener) => {
  const server: http.Server = http.createServer(expressApp);
  const io: socketio.Server = new socketio.Server();
  io.attach(server);

  io.on("connection", (socket: socketio.Socket) => {
    socket.on("login", (sender: User, reciever: User) => {
      socket.join(`${sender.id}-${reciever.id}`);
      socket.join(`${reciever.id}-${sender.id}`);

      socket.on("message", async (data: { message: string }) => {
        const message = await prisma.message.create({
          data: {
            senderId: sender.id,
            recieverId: reciever.id,
            content: data.message,
          },
        });

        io.to(`${sender.id}-${reciever.id}`)
          .to(`${reciever.id}-${sender.id}`)
          .emit("message", message);
      });

      socket.on("disconnect", () => {
        socket.leave(`${sender.id}-${reciever.id}`);
        socket.leave(`${reciever.id}-${sender.id}`);
      });
    });
  });

  return server;
};

export default createServer;
