import { afterAll, beforeAll, describe, it } from "vitest";
import { app } from '@/app'
import request from 'supertest'

describe("Register E2E Test", async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register a user", async () => {
    await request(app.server).post('/users')
    .send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
      passwordConfirm: "123456"
    })
    .expect(201)
  })
})