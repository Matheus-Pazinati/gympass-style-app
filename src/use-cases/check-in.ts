import { CheckInRepository } from "@/repositories/checkin-repository";
import { GymRepository } from "@/repositories/gym-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceReachedError, MaxNumberOfCheckInsError } from "./errors/checkin-errors";

interface CheckInUseCaseRequest {
  gymId: string
  userId: string
  userLatitute: number
  userLongitude: number
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
    userLatitute,
    userLongitude
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distanceBetweenUserAndGym = getDistanceBetweenCoordinates(
      {latitude: userLatitute, longitude: userLongitude},
      {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
    )
    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distanceBetweenUserAndGym > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceReachedError()
    }

    const checkInOnSameDay = await this.checkinRepository.findByUserIdOnDate(userId, new Date())

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
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