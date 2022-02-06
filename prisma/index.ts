import { PrismaClient } from "@prisma/client";
import { fieldEncryptionMiddleware } from "prisma-field-encryption";

export const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);
  return JSON.parse(JSON.stringify(result));
});

prisma.$use(
  fieldEncryptionMiddleware({
    encryptionKey: process.env.PRISMA_SECRET,
  })
);
