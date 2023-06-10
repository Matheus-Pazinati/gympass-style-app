import { prisma } from "@/lib/prisma";
import { Prisma, User } from '@prisma/client'
import { UserRepository } from "../user-repository";

export class PrismaUserRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data
    })

    return user
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })
    return user
  }
}