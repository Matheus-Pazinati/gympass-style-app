import { validateJWTSignature } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { search } from "./search";
import { searchNearby } from "./search-nearby";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', validateJWTSignature)

  app.post("/gyms", { onRequest: verifyUserRole("ADMIN") }, create)
  
  app.get("/gyms", search)
  app.get("/gyms/nearby", searchNearby)
}