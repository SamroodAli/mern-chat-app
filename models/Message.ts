import { prisma } from "../prisma";
import { PrismaClient, Message, User } from "@prisma/client";
import { UserModel } from "./User";

class Messages {
  constructor(private readonly prisma: PrismaClient["message"]) {}
  async getMessages(
    senderId: string,
    recieverId: string,
    take?: number,
    order: "asc" | "desc" = "asc"
  ) {
    return this.prisma.findMany({
      take,
      orderBy: {
        id: order,
      },
      include: {
        sender: true,
        reciever: true,
      },
      where: {
        OR: [
          {
            sender: {
              id: senderId,
            },
            reciever: {
              id: recieverId,
            },
          },
          {
            sender: {
              id: recieverId,
            },
            reciever: {
              id: senderId,
            },
          },
        ],
      },
    });
  }

  getMessagesWith(ids: number[]) {
    return prisma.message.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  forwardMessages(sender: User, messages: Message[], users: User[]) {
    const promises = users.map((user) => {
      return prisma.message.createMany({
        data: messages.map((message) => ({
          content: message.content,
          recieverId: user.id,
          senderId: sender.id,
        })),
      });
    });
    return Promise.all(promises);
  }

  async forwardToUsers(
    sender: User,
    messageIds: Message["id"][],
    userIds: User["id"][]
  ) {
    const usersPromise = UserModel.getUsersWith(userIds);
    const messagesPromise = MessageModel.getMessagesWith(messageIds);
    const [users, messages] = await Promise.all([
      usersPromise,
      messagesPromise,
    ]);
    return this.forwardMessages(sender, messages, users);
  }
}

export const MessageModel = new Messages(prisma.message);
