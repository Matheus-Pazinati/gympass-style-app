import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authentication } from "./controllers/authentication";
import { profile } from "./controllers/profile";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authentication)
  app.get("/me", profile)
}