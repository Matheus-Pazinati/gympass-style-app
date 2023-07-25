import { app } from "@/app";
import { describe, beforeAll, afterAll, vi, expect, it } from "vitest";
import request from 'supertest'
import { createAndAuthenticateUser } from "@/utils/test/create-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Get User Check-ins Metrics E2E Test", async() => {
  beforeAll(async() => {
    await app.ready()
    vi.useFakeTimers()
  })

  afterAll(async() => {
    await app.close()
    vi.useRealTimers()
  })

  it("should be able to get user check-ins metrics", async () => {
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

    vi.setSystemTime(new Date(2023, 1, 1, 2, 0, 0))

    await request(app.server).post(`/gyms/${id}/check-ins`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      user_latitude: -22.5688278,
      user_longitude: -48.6357383
    })

    vi.setSystemTime(new Date(2023, 1, 2, 2, 0, 0))

    await request(app.server).post(`/gyms/${id}/check-ins`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      user_latitude: -22.5688278,
      user_longitude: -48.6357383
    })

    const response = await request(app.server).get("/check-ins/metrics")
    .set("Authorization", `Bearer ${token}`)
    .send()

    expect(response.status).toEqual(200)
    expect(response.body.userCheckinsAmount).toEqual(2)

  })
})