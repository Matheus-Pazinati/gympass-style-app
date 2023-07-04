import { GymRepository } from "@/repositories/gym-repository";
import { Gym } from "@prisma/client";

interface CreateGymUseCaseRequest {
  name: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    name,
    phone
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude
    })

    return {
      gym,
    }
  }
}