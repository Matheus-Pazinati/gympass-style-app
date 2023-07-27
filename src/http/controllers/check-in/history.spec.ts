import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-authenticate-user";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest"

describe("Get the User Check-ins History E2E Test", async() => {
  beforeAll(async() => {
    await app.ready()
    vi.useFakeTimers()
  })

  afterAll(async() => {
    await app.close()
    vi.useRealTimers()
  })

  it("should be able to get user check-ins history", async() => {
    const { token } = await createAndAuthenticateUser(app)

    const firstGym = await prisma.gym.create({
      data: {
        name: "Javascript Gym",
        latitude: -22.5688278,
        longitude: -48.6357383
      }
    })

    const secondGym = await prisma.gym.create({
      data: {
        name: "Typescript Gym",
        latitude: -22.5688277,
        longitude: -48.6357382
      }
    })

    vi.setSystemTime(new Date(2023, 1, 1, 2, 0, 0))

    await request(app.server).post(`/gyms/${firstGym.id}/check-ins`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      user_latitude: -22.5688278,
      user_longitude: -48.6357383
    })

    vi.setSystemTime(new Date(2023, 1, 2, 2, 0, 0))

    await request(app.server).post(`/gyms/${secondGym.id}/check-ins`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      user_latitude: -22.5688277,
      user_longitude: -48.6357382
    })

    const response = await request(app.server).get("/check-ins/history")
    .set("Authorization", `Bearer ${token}`)
    .send()

    expect(response.status).toEqual(200)
    expect(response.body.userCheckIns).toHaveLength(2)
    expect(response.body.userCheckIns).toEqual(expect.arrayContaining([
      expect.objectContaining({
        gym_id: firstGym.id
      }),
      expect.objectContaining({
        gym_id: secondGym.id
      })
    ]))
  })
})