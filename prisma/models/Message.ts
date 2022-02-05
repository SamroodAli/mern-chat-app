import { prisma } from "../client";
import { PrismaClient } from "@prisma/client";

class Messages {
  constructor(private readonly prisma: PrismaClient["message"]) {}
  async getMessages(senderId: string, recieverId: string) {
    return this.prisma.findMany({
      orderBy: {
        createdAt: "asc",
      },

      select: {
        id: true,
        content: true,
        createdAt: false,
        updatedAt: false,
        senderId: true,
        sender: {
          select: {
            id: true,
            username: true,
            updatedAt: false,
            createdAt: false,
          },
        },
        reciever: {
          select: {
            id: true,
            username: true,
            updatedAt: false,
            createdAt: false,
          },
        },
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
