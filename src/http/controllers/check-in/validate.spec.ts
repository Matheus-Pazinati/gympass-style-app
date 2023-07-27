import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"
import { createAndAuthenticateUser } from "@/utils/test/create-authenticate-user";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

describe("Validate Check-in E2E Test", async() => {
  beforeAll(async() => {
    await app.ready()
  })

  afterAll(async() => {
    await app.close()
  })

  it("should be able to validate a check-in", async() => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.create({
      data: {
        email: "math@example.com",
        name: "John Doe",
        password_hash: await hash("123456", 6)
      }
    })

    const gym = await prisma.gym.create({
      data: {
        name: "Javascript Gym",
        latitude: -22.5688278,
        longitude: -48.6357383
      }
    })

    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      }
    })

    await request(app.server).patch(`/check-ins/${checkIn.id}/validate`)
    .set("Authorization", `Bearer ${token}`)
    .send()
    .expect(204)

    const validatedCheckIn = await prisma.checkIn.findUnique({
      where: {
        id: checkIn.id
      }
    })

    expect(validatedCheckIn?.validated_at).toEqual(expect.any(Date))
  })
})