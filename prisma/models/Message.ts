import { prisma } from "../client";
import { PrismaClient } from "@prisma/client";

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
}

export const MessageModel = new Messages(prisma.message);
