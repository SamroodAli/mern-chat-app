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

        io.to(senderRoom).to(recieverRoom).emit("message", message);
      });

      socket.on(
        "forward",
        async ({
          messages,
          users,
          cb,
        }: {
          messages: string[];
          users: string[];
          cb: (data: { status: string }) => void;
        }) => {
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
                senderId: sender.id,
              })),
            });
          });
          await Promise.all(promises);
          cb({ status: "success" });
        }
      );

      socket.on("disconnect", () => {
        socket.leave(senderRoom);
        socket.leave(recieverRoom);
      });
    });
  });

  return server;
};

export default createServer;
