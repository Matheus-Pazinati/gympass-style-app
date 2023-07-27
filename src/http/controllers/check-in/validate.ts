import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-checkin-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateRequestParamsSchema = z.object({
    checkinId: z.string().uuid()
  })

  const { checkinId } = validateRequestParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  try {
    await validateCheckInUseCase.execute({
      checkInId: checkinId
    })
    reply.status(204).send()
  } catch (error) {
    if (error instanceof Error) {
      reply.status(400).send({
        error: error.message
      })
    }
  }
}