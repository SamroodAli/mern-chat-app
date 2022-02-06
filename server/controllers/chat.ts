import * as socketio from "socket.io";
import { User } from "@prisma/client";
import { MessageModel } from "../../models";
import { prisma } from "../../prisma";

export class ChatController {
  constructor(socket: socketio.Socket) {
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

        socket.to(senderRoom).to(recieverRoom).emit("message", message);
      });

      socket.on(
        "forward",
        async (
          forwardMessages: number[],
          forwardUsers: string[],
          cb: (data: { status: string }) => void
        ) => {
          await MessageModel.forwardToUsers(
            sender,
            forwardMessages,
            forwardUsers
          );

          cb({ status: "success" });
        }
      );

      socket.on("disconnect", () => {
        socket.leave(senderRoom);
        socket.leave(recieverRoom);
      });
    });
  }
}
