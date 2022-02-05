import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);
  if (Array.isArray(result)) {
    return result.map((item: any) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }
  return {
    ...result,
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  };
});
