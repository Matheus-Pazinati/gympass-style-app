import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"
import { createAndAuthenticateUser } from "@/utils/test/create-authenticate-user";

describe("Search a Gym E2E Test", async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to search a gym by his name", async () => {

    const { token } = await createAndAuthenticateUser(app)

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: "Javascript Gym",
      description: "The Best Gym",
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
      latitude: -22.5688278,
      longitude: -48.6357383,
    })

    const response = await request(app.server).get("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .query({
      q: "Javascript"
    })
    .send()
    .expect(200)

    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        description: "The Best Gym"
      })
    ])
  })
})