import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-checkin-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-checkins-history";

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(prismaCheckInRepository)

  return useCase
}