import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-checkins-history-usecase";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const historyRequestQuerySchema = z.object({
    page: z.coerce.number().optional().default(1)
  })
  const historyRequestUserSchema = z.string().uuid()

  const { page } = historyRequestQuerySchema.parse(request.query)
  const userId = historyRequestUserSchema.parse(request.user.sub)

  const historyUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { userCheckIns } = await historyUseCase.execute({
    page,
    userId
  })

  reply.status(200).send({
    userCheckIns
  })
}