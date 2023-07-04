import { CheckInRepository } from "@/repositories/checkin-repository"
import { CheckIn } from "@prisma/client"

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  userCheckIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    userId
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const userCheckIns = await this.checkInsRepository.findManyByUserId(userId)

    return {
      userCheckIns
    }
  }
}