import { GymRepository } from "@/repositories/gym-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
  page: number
}

interface FetchNearbyGymsUseCaseResponse {
  nearbyGyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    userLatitude, userLongitude, page
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const nearbyGyms = await this.gymRepository.findManyNearby({
      page,
      userLatitude,
      userLongitude
    })

    return {
      nearbyGyms
    }
  }
}