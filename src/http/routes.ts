import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authentication } from "./controllers/authentication";
import { profile } from "./controllers/profile";
import { validateJWTSignature } from "./middlewares/jwt-verify";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authentication)

  // authenticated routes
  app.get("/me", { preHandler: validateJWTSignature }, profile)
}