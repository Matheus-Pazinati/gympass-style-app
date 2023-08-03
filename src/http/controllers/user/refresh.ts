import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })
  console.log(request.cookies.refreshToken)

  const userRole = request.user.role

  const token = await reply.jwtSign({
    role: userRole
  }, {
    sign: {
      sub: request.user.sub,
      expiresIn: '1h'
    }
  })

  const refreshToken = await reply.jwtSign({
    role: userRole
  }, {
    sign: {
      sub: request.user.sub,
      expiresIn: '7d'
    }
  })

  return reply
  .setCookie('refreshToken', refreshToken, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: true
  })
  .status(200)
  .send({
    token
  })
}