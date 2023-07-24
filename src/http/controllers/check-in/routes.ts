import { validateJWTSignature } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";
import { userMetrics } from "./user-metrics";

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', validateJWTSignature)

  app.get("/user-metrics", userMetrics)
}