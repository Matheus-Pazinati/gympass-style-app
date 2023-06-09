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
    const { user } = await authenticationUseCase.execute({
      email,
      password
    })
    const token = await reply.jwtSign({}, {
      sign: {
        sub: user.id
      }
    })

    return reply.status(200).send({
      token
    })
    
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}