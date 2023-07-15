import { FastifyRequest, FastifyReply } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()

  console.log(request.user.sub)

  reply.status(200).send()
} 