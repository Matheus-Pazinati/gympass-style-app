import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error"
import { makeAuthenticateUseCase } from "@/use-cases/factories/make.authenticate-usecase"

export async function authentication (request: FastifyRequest, reply: FastifyReply) {
  const AuthenticationBodySchema = z.object({
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "Sua senha deve conter no mínimo 6 caracteres" }),
  })

  const { email, password } = AuthenticationBodySchema.parse(request.body)
  try {
    const authenticationUseCase = makeAuthenticateUseCase()
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