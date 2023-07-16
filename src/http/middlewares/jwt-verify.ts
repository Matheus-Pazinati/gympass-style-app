import { FastifyReply, FastifyRequest } from "fastify";

export async function validateJWTSignature(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    reply.send(error)
  }
}