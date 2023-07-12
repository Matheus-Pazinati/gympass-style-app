import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { GetUserProfileUseCase } from "../get-user-profile";

export function makeGetUserProfileUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const useCase = new GetUserProfileUseCase(prismaUserRepository)

  return useCase
}