import { Prisma, Gym } from "@prisma/client";
import { FindManyNearbyParams, GymRepository } from "../gym-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymRepository implements GymRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data
    })

    return gym
  }
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    })

    return gym
  }
  async findManyNearby({ userLatitude, userLongitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      skip: (page - 1) * 20,
      take: 20,
      where: {
        name: {
          contains: query
        }
      }
    })

    return gyms
  }
}