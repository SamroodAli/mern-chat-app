import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);
  return JSON.parse(JSON.stringify(result));
});
