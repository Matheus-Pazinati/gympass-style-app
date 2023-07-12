import { CheckInRepository } from "@/repositories/checkin-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  userCheckinsAmount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkinRepository: CheckInRepository) {}

  async execute({
    userId
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const userCheckinsAmount = await this.checkinRepository.countByUserId(userId)

    return {
      userCheckinsAmount
    }
  }
}