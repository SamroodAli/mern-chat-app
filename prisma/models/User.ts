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
