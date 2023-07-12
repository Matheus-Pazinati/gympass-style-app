import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";
import { SearchGymsUseCase } from "../search-gyms";

export function makeSearchGymsUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const useCase = new SearchGymsUseCase(prismaGymRepository)

  return useCase
}