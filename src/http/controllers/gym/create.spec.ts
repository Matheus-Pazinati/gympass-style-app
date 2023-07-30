import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { createAndAuthenticateUser } from "@/utils/test/create-authenticate-user";

describe("Create a Gym E2E Test", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create a gym", async () => {

    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: "Javascript GYM",
      description: "The best GYM",
      phone: "123456789",
      latitude: -22.5688278,
      longitude: -48.6357383,
    })
    .expect(201)
  })
})