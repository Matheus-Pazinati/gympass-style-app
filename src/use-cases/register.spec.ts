import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it("should hash user password uppon register", async () => {
    const registerUseCase = new RegisterUseCase({
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date()
        }
      },
      async findByEmail(email) {
        return null
      }
    })

    const { user } = await registerUseCase.execute({
      email: "johndoe@email.com",
      name: "John Doe",
      password: "123456"
    })

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})