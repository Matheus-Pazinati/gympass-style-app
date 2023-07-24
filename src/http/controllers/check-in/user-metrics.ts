import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-usecase";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function userMetrics(request: FastifyRequest, reply: FastifyReply) {
  const userMetricsUseCase = makeGetUserMetricsUseCase()
  const userMetricsRequestSchema = z.object({
    userId: z.string().uuid()
  })

  const { userId } = userMetricsRequestSchema.parse(request.user.sub)

  const { userCheckinsAmount } = await userMetricsUseCase.execute({
    userId
  })

  reply.status(200).send({
    userCheckinsAmount
  })
}