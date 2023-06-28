import { CheckInRepository } from "@/repositories/checkin-repository";
import { GymRepository } from "@/repositories/gym-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CheckInUseCaseRequest {
  gymId: string
  userId: string
  latitute: number
  longitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkinRepository: CheckInRepository,
    private gymRepository: GymRepository
    ) {}

  async execute({
    gymId,
    userId,
    latitute,
    longitude
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDay = await this.checkinRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnSameDay) {
      throw new Error()
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