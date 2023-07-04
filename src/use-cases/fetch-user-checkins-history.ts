import { CheckInRepository } from "@/repositories/checkin-repository"
import { CheckIn } from "@prisma/client"

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  userCheckIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    userId,
    page
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const userCheckIns = await this.checkInsRepository.findManyByUserId(userId, page)

    return {
      userCheckIns
    }
  }
}