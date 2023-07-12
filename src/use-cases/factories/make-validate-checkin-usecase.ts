import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-checkin-repository";
import { ValidateCheckInUseCase } from "../validate-checkin";

export function makeValidateCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const useCase = new ValidateCheckInUseCase(prismaCheckInRepository)

  return useCase
}