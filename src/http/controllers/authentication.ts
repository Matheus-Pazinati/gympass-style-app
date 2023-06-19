import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { AuthenticationUseCase } from "@/use-cases/authentication"
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error"

export async function authentication (request: FastifyRequest, reply: FastifyReply) {
  const AuthenticationBodySchema = z.object({
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "Sua senha deve conter no mínimo 6 caracteres" }),
  })

  const { email, password } = AuthenticationBodySchema.parse(request.body)
  try {
    const prismaUsersRepository = new PrismaUserRepository()
    const authenticationUseCase = new AuthenticationUseCase(prismaUsersRepository)
    await authenticationUseCase.execute({
      email,
      password
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }

  return reply.status(200).send()
}