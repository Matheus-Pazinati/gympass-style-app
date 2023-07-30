import { validateJWTSignature } from "@/http/middlewares/jwt-verify";
import { FastifyInstance } from "fastify";

import { metrics } from "./metrics";
import { create } from "./create";
import { history } from "./history";
import { validate } from "./validate";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', validateJWTSignature)

  app.post("/gyms/:gymId/check-ins", create)
  app.get("/check-ins/metrics", metrics)
  app.get("/check-ins/history", history)
  app.patch("/check-ins/:checkinId/validate", { onRequest: verifyUserRole('ADMIN') }, validate)
}