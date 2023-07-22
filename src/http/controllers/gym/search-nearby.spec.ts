import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-authenticate-user";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"

describe("Search Nearby Gyms E2E Test", async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to search nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: "Javascript Gym",
      description: "",
      phone: "",
      latitude: -22.5688278,
      longitude: -48.6357383,
    })

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: "Typescript Gym",
      description: "",
      phone: "",
      latitude: -21.0170601,
      longitude: -45.0309648,
    })
    .expect(201)

    const response = await request(app.server).get("/gyms/nearby")
    .set('Authorization', `Bearer ${token}`)
    .query({
      latitude: -22.5688278,
      longitude: -48.6357383
    })
    .send()

    expect(response.body.nearbyGyms).toHaveLength(1)
    expect(response.body.nearbyGyms).toEqual([
      expect.objectContaining({
        name: "Javascript Gym"
      })
    ])
  })
})