import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { AuthenticationUseCase } from "../authentication"

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUserRepository()
  const authenticationUseCase = new AuthenticationUseCase(prismaUsersRepository)

  return authenticationUseCase
}