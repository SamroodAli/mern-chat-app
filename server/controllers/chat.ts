import * as socketio from "socket.io";
import { User } from "@prisma/client";
import { MessageModel } from "../../models";

export class ChatController {
  constructor(socket: socketio.Socket, io: socketio.Server) {
    socket.on("login", (sender: User, reciever: User) => {
      const senderRoom = `${sender.id}-${reciever.id}`;
      const recieverRoom = `${reciever.id}-${sender.id}`;
      socket.join(senderRoom);
      socket.join(recieverRoom);

      socket.on("message", async (data: { message: string }) => {
        // let message;
        const message = await MessageModel.sendMessage(
          sender,
          reciever,
          data.message
        );

        io.to(senderRoom).to(recieverRoom).emit("message", message);
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
