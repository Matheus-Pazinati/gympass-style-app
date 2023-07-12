import { CheckIn, Prisma } from "@prisma/client";
import { CheckInRepository } from "../checkin-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckInRepository implements CheckInRepository {  
  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate()
        }
      },
    })

    return checkIn
  }
  async findById(checkInId: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id: checkInId
      }
    })

    return checkIn
  }
  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      take: 20,
      skip: (page - 1) * 20,
      where: {
        user_id: userId
      }
    })

    return checkIns
  }
  async countByUserId(userId: string) {
    return await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })
  }
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const newCheckIn = await prisma.checkIn.create({
      data
    })

    return newCheckIn
  }
  async save(checkIn: CheckIn) {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: checkIn.id
      },
      data: checkIn
    })

    return updatedCheckIn
  }
}