import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-usecase";
import { FastifyRequest, FastifyReply } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {

  const profileUseCase = makeGetUserProfileUseCase()
  const { user } = await profileUseCase.execute({
    userId: request.user.sub
  })

  reply.status(200).send({...user, password_hash: undefined})
} 