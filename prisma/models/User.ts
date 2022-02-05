import { prisma } from "../client";
import { PrismaClient, User } from "@prisma/client";

class Users {
  constructor(private readonly prisma: PrismaClient["user"]) {}

  async getUsersOtherThan(user: User) {
    return this.prisma.findMany({
      where: {
        NOT: {
          id: user.id,
        },
      },
      select: {
        username: true,
        id: true,
      },
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
