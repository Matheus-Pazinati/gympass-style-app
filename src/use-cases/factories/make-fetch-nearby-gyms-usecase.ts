import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";

export function makeFetchNearbyGymsUseCase() {
  const prismaGymRepository = new PrismaGymRepository()
  const useCase = new FetchNearbyGymsUseCase(prismaGymRepository)

  return useCase
}