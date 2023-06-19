import { FastifyInstance } from "fastify";
import { register } from "./controllers/register";
import { authentication } from "./controllers/authentication";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authentication)
}