import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymUseCase = makeCreateGymUseCase()

  const MAX_LATITUDE_VALUE = 90
  const MAX_LONGITUDE_VALUE = 180

  const createGymBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine((latitude) => {
      return Math.abs(latitude) <= MAX_LATITUDE_VALUE
    }),
    longitude: z.coerce.number().refine((longitude) => {
      return Math.abs(longitude) <= MAX_LONGITUDE_VALUE
    })
  })

  const { name, description, latitude, longitude, phone } = createGymBodySchema.parse(request.body)

  await createGymUseCase.execute({
    name,
    description,
    phone,
    latitude,
    longitude
  })

  reply.status(201).send()
}