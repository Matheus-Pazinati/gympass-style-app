import { validateJWTSignature } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";
import { searchNearby } from "./search-nearby";

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', validateJWTSignature)

  app.post("/gyms", create)
  
  app.get("/gyms", search)
  app.get("/gyms/nearby", searchNearby)
}