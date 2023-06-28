import { CheckInRepository } from "@/repositories/checkin-repository";
import { CheckIn } from "@prisma/client";

interface CheckInUseCaseRequest {
  gymId: string
  userId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkinRepository: CheckInRepository) {}

  async execute({
    gymId,
    userId
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

    const checkInOnSameDay = await this.checkinRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkinRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }

}