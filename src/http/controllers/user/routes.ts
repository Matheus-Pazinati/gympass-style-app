import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authentication } from "./authentication";
import { profile } from "./profile";
import { validateJWTSignature } from "../../middlewares/jwt-verify";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authentication)

  // authenticated routes
  app.get("/me", { preHandler: validateJWTSignature }, profile)
}