import { prisma } from "../client";
import { Message, PrismaClient, User } from "@prisma/client";

export interface UserWithLastMessage extends User {
  lastMessage: Message | null;
}

interface UserModel {
  getUsersWithLastMessage(currentUser: User): Promise<UserWithLastMessage[]>;
  getCurrentUser(username: User["username"]): Promise<User | null>;
}

class Users implements UserModel {
  constructor(private readonly prisma: PrismaClient["user"]) {}

  async getUsersWithLastMessage(currentUser: User) {
    const users = await this.prisma.findMany({
      where: {
        NOT: {
          id: currentUser.id,
        },
      },
      include: {
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
    });
  }
}

export const UserModel = new Users(prisma.user);
