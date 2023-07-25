import { validateJWTSignature } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { userMetrics } from "./user-metrics";
import { create } from "./create";

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', validateJWTSignature)

  app.post("/gyms/:gymId/check-ins", create)
  app.get("/user-metrics", userMetrics)
}