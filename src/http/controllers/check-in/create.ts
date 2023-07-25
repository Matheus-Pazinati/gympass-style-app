import { makeCheckInUseCase } from "@/use-cases/factories/make-checkin-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const MAX_LATITUDE_VALUE = 90
  const MAX_LONGITUDE_VALUE = 180

  const checkInRequestBodySchema = z.object({
    user_latitude: z.coerce.number().refine((latitude) => {
      return Math.abs(latitude) <= MAX_LATITUDE_VALUE
    }),
    user_longitude: z.coerce.number().refine((longitude) => {
      return Math.abs(longitude) <= MAX_LONGITUDE_VALUE
    })
  })

  const checkInUserIdRequestSchema = z.string().uuid()

  const gymIdRequestRouteSchema = z.object({
    gymId: z.string().uuid()
  })

  const { user_latitude, user_longitude } = checkInRequestBodySchema.parse(request.body)
  const user_id = checkInUserIdRequestSchema.parse(request.user.sub)
  const { gymId } = gymIdRequestRouteSchema.parse(request.params)

  const checkInUseCase = makeCheckInUseCase()

  try {
    await checkInUseCase.execute({
      gymId,
      userId: user_id,
      userLatitute: user_latitude,
      userLongitude: user_longitude
    })
    return reply.status(201).send()

  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send(error.message)
    }
  }
}