import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from "@/utils/test/create-authenticate-user";

describe("Profile E2E Test", async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get user profile", async () => {

    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server).get('/me')
    .set('Authorization', `Bearer ${token}`)
    .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({
      name: "John Doe"
    }))
  })
})