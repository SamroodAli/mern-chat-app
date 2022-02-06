import * as socketio from "socket.io";
import { User } from "@prisma/client";
import { MessageModel } from "../../../models";

export class ForwardController {
  constructor(public socket: socketio.Socket, public sender: User) {
    this.socket = socket;
    this.sender = sender;
    this.startForwardMessasing();
  }

  startForwardMessasing = () => {
    this.socket.on("forward", this.onForward);
  };

  onForward = async (
    forwardMessages: number[],
    forwardUsers: string[],
    cb: (data: { status: string }) => void
  ) => {
    await MessageModel.forwardToUsers(
      this.sender,
      forwardMessages,
      forwardUsers
    );
    cb({ status: "success" });
  };
}
