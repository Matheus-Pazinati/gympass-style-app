import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-checkin-repository";
import { CheckInUseCase } from "../check-in";
import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

export function makeCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const prismaGymRepository = new PrismaGymRepository()
  const useCase = new CheckInUseCase(prismaCheckInRepository, prismaGymRepository)

  return useCase
}