// import { User } from "@prisma/client";
import { User } from "@prisma/client";
import * as http from "http";
import * as socketio from "socket.io";
import { prisma } from "../prisma/client";
// import { prisma } from "../prisma";

const createServer = (expressApp: http.RequestListener) => {
  const server: http.Server = http.createServer(expressApp);
  const io: socketio.Server = new socketio.Server();
  io.attach(server);

  io.on("connection", (socket: socketio.Socket) => {
    socket.on("login", (sender: User, reciever: User) => {
      const senderRoom = `${sender.id}-${reciever.id}`;
      const recieverRoom = `${reciever.id}-${sender.id}`;
      socket.join(senderRoom);
      socket.join(recieverRoom);

      socket.on("message", async (data: { message: string }) => {
        // let message;

        const message = await prisma.message.create({
          data: {
            senderId: sender.id,
            recieverId: reciever.id,
            content: data.message,
          },
        });

        //@ts-ignore
        if (io.sockets.adapter.rooms.get(senderRoom).size === 1) {
          console.log("Alone");
        }

        io.to(senderRoom).to(recieverRoom).emit("message", message);
      });
      socket.on("disconnect", () => {
        socket.leave(senderRoom);
        socket.leave(recieverRoom);
      });
    });
  });

  return server;
};

export default createServer;
