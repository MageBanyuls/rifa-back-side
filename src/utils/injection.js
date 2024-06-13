import { PrismaClient, Prisma } from "@prisma/client";
import { HttpResponseHandlder } from "./handlerResponse.js";
export const ResponseHandler = new HttpResponseHandlder()

export const prisma = new PrismaClient()

export const prismaError = Prisma