import { prisma } from "../client";
import { PrismaClient, User } from "@prisma/client";

class Users {
  constructor(private readonly prisma: PrismaClient["user"]) {}

  async getUsersWithLastMessage(currentUser: User) {
    const users = await this.prisma.findMany({
      where: {
        NOT: {
          id: currentUser.id,
        },
      },
      select: {
        username: true,
        id: true,
        createdAt: false,
        updatedAt: false,
        messagesRecieved: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
        messagesSent: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return users.map((user) => {
      if (
        user.messagesRecieved[0]?.createdAt > user.messagesSent[0]?.createdAt
      ) {
        return { ...user, lastMessage: user.messagesRecieved[0] || null };
      }
      return { ...user, lastMessage: user.messagesSent[0] || null };
    });
  }

  async getCurrentUser(username: string) {
    return await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        createdAt: false,
        updatedAt: false,
      },
    });
  }
}

export const UserModel = new Users(prisma.user);
