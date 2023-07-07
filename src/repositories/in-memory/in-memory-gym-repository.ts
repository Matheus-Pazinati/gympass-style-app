import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymRepository } from "../gym-repository";
import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.items.find(item => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {latitude: params.userLatitude, longitude: params.userLongitude},
        {latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber()}
      )

      const MAX_DISTANCE = 10 // 10 kilometers

      return distance < MAX_DISTANCE
    })
    .slice((params.page - 1) * 20, params.page * 20)
  }

  async searchMany(query: string, page: number) {
    return this.items.filter((item) => item.name.includes(query))
    .slice((page - 1) * 20, page * 20)
  }
}