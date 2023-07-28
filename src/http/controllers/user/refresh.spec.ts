import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"

describe("Refresh Token E2E Test", async() => {
  beforeAll(async() => {
    await app.ready()
  })

  afterAll(async() => {
    await app.close()
  })

  it("should be able to refresh authenticate token after it expires", async() => {
    await request(app.server).post('/users')
    .send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
      passwordConfirm: "123456"
    })
  
    const authenticationResponse = await request(app.server).post('/sessions')
    .send({
      email: "johndoe@example.com",
      password: "123456"
    })

    const cookies = authenticationResponse.get("Set-Cookie")

    const response = await request(app.server).patch("/token/refresh")
    .set("Cookie", cookies)
    .send()
    .expect(200)

    expect(response.body).toEqual({
      token: expect.any(String)
    })

    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken=")
    ])
  })
})