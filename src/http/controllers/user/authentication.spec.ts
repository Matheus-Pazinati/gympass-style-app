import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'
import { app } from '@/app'

describe("Authentication E2E Test", async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to authenticate a user", async () => {
    await request(app.server).post('/users')
    .send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
      passwordConfirm: "123456"
    })

    const response = await request(app.server).post('/sessions')
    .send({
      email: "johndoe@example.com",
      password: "123456"
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({
      token: expect.any(String)
    }))
  })
})