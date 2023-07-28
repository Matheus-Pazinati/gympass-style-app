import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authentication } from "./authentication";
import { profile } from "./profile";
import { validateJWTSignature } from "../../middlewares/jwt-verify";
import { refresh } from "./refresh";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authentication)
  app.patch("/token/refresh", refresh)

  // authenticated routes
  app.get("/me", { preHandler: validateJWTSignature }, profile)
}