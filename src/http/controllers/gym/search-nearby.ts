import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function searchNearby(request: FastifyRequest, reply: FastifyReply) {
  const searchNearbyUseCase = makeFetchNearbyGymsUseCase()

  const MAX_LATITUDE_VALUE = 90
  const MAX_LONGITUDE_VALUE = 180

  const searchNearbyQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    latitude: z.coerce.number().refine((latitude) => {
      return Math.abs(latitude) <= MAX_LATITUDE_VALUE
    }),
    longitude: z.coerce.number().refine((longitude) => {
      return Math.abs(longitude) <= MAX_LONGITUDE_VALUE
    })
  })

  const { latitude, longitude, page } = searchNearbyQuerySchema.parse(request.query)

  const { nearbyGyms } = await searchNearbyUseCase.execute({
    page,
    userLatitude: latitude,
    userLongitude: longitude
  })

  reply.status(200).send({
    nearbyGyms
  })
}