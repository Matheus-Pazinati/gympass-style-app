import { prisma } from "@/lib/prisma"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

export async function register (request: FastifyRequest, reply: FastifyReply) {
  const RegisterBodySchema = z.object({
    name: z.string(),
    email: z.string().email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "Sua senha deve conter no mínimo 6 caracteres" }),
    passwordConfirm: z.string().min(6, { message: "Sua senha deve conter no mínimo 6 caracteres" })
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas devem ser iguais",
    path: ["passwordConfirm"]
  })

  const { name, email, password } = RegisterBodySchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password
    }
  })

  reply.status(201).send()
}