import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-authenticate-user";
import { afterAll, beforeAll, describe, it } from "vitest";
import request from "supertest"
import { prisma } from "@/lib/prisma";

describe("Create a Check-In E2E Test", async() => {
  beforeAll(async() => {
    await app.ready()
  })

  afterAll(async() => {
    await app.close()
  })

  it("should be able to create a check-in", async() => {
    const { token } = await createAndAuthenticateUser(app)

    const { id } = await prisma.gym.create({
      data: {
        name: "Javascript GYM",
        description: "The best GYM",
        phone: "123456789",
        latitude: -22.5688278,
        longitude: -48.6357383,
      }
    })

    await request(app.server).post(`/gyms/${id}/check-ins`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      user_latitude: -22.5688278,
      user_longitude: -48.6357383
    })
    .expect(201)

  })
})