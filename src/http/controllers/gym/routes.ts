import { validateJWTSignature } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";

export function gymRoutes(app: FastifyInstance) {
  app.addHook('preHandler', validateJWTSignature)

  app.post("/gyms", create)
  app.get("/gyms", search)
}