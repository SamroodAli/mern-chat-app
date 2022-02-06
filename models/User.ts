import { prisma } from "../prisma";
import { PrismaClient, User } from "@prisma/client";
import { MessageModel } from "./Message";

class Users {
  constructor(private readonly prisma: PrismaClient["user"]) {}

  createUser(username: string, email: string, password: string) {
    return prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
  }

  async getUsersOtherThan(user: User) {
    const users = await this.prisma.findMany({
      where: {
        NOT: {
          id: user.id,
        },
      },
    });
    return Promise.all(
      users.map(async (reciever) => {
        const lastMessage = await MessageModel.getMessages(
          user.id,
          reciever.id,
          1,
          "desc"
        );
        return {
          ...reciever,
          lastMessage: lastMessage.length ? lastMessage[0] : null,
        };
      })
    );
  }

  findUser(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  getAllUsers() {
    return this.prisma.findMany();
  }

  getUsersWith(ids: string[]) {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
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
