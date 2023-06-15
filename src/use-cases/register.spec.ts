import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'

describe('Register Use Case', () => {
  it("should hash user password uppon register", async () => {
    const inMemoryRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(inMemoryRepository)

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