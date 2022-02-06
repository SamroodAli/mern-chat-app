import * as socketio from "socket.io";
import { User } from "@prisma/client";
import { MessageModel } from "../../../models";

export class ChatController {
  public senderRoom?: string;
  public recieverRoom?: string;

  constructor(
    public socket: socketio.Socket,
    public io: socketio.Server,
    public sender: User,
    public reciever: User
  ) {
    this.chatBetweenTwoUsers();
  }

  chatBetweenTwoUsers = () => {
    this.createRoomBetweenTwoUsers();
    this.socket.on("message", this.onMessage);
    this.socket.on("disconnect", this.leaveRooms);
  };

  createRoomBetweenTwoUsers = () => {
    this.senderRoom = `${this.sender.id}-${this.reciever.id}`;
    this.recieverRoom = `${this.reciever.id}-${this.sender.id}`;
    this.socket.join(this.senderRoom);
    this.socket.join(this.recieverRoom);
  };

  leaveRooms = () => {
    this.socket.leave(this.senderRoom!);
    this.socket.leave(this.recieverRoom!);
  };

  onMessage = async (content: string) => {
    const message = await MessageModel.sendMessage(
      this.sender,
      this.reciever,
      content
    );

    this.io
      .to(this.senderRoom!)
      .to(this.recieverRoom!)
      .emit("message", message);
  };
}
