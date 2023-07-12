import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-checkin-repository";
import { GetUserMetricsUseCase } from "../get-user-metrics";

export function makeGetUserMetricsUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const useCase = new GetUserMetricsUseCase(prismaCheckInRepository)

  return useCase
}