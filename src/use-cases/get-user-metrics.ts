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
    const userCheckins = await this.checkinRepository.countByUserId(userId)

    if (!userCheckins) {
      throw new Error('')
    }

    const userCheckinsAmount = userCheckins

    return {
      userCheckinsAmount
    }
  }
}