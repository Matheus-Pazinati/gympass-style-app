import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from '@/app'
import request from 'supertest'

describe("Profile E2E Test", async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to get user profile", async () => {

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

    const { token } = authenticationResponse.body

    const response = await request(app.server).get('/me')
    .set('Authorization', `Bearer ${token}`)
    .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({
      name: "John Doe"
    }))
  })
})