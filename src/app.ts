import fastify from "fastify"
import fastifyJwt from "@fastify/jwt"
import fastifyCookie from "@fastify/cookie"

import { ZodError } from "zod"

import { env } from "./env"

import { userRoutes } from "./http/controllers/user/routes"
import { gymRoutes } from "./http/controllers/gym/routes"
import { checkInRoutes } from "./http/controllers/check-in/routes"

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_TOKEN,
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  },
  sign: {
    expiresIn: '10m'
  }
})

app.register(fastifyCookie)

app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply
    .status(400)
    .send({ message: "Validation error.", issues: error.format() })
  }

  if (env.NODE_ENV !== "production") {
    console.error(error)
  }

  return reply.status(500).send({ message: "Internal server error." })
})