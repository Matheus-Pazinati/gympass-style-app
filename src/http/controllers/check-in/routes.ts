import { validateJWTSignature } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { metrics } from "./metrics";
import { create } from "./create";

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', validateJWTSignature)

  app.post("/gyms/:gymId/check-ins", create)
  app.get("/check-ins/metrics", metrics)
}