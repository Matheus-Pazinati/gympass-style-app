import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";
import { CreateGymUseCase } from "../create-gym";

export function makeCreateGymUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const useCase = new CreateGymUseCase(prismaGymRepository)

  return useCase
}