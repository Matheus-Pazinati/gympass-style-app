import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {

  let userRepository: InMemoryUserRepository;
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    registerUseCase = new RegisterUseCase(userRepository)
  })
  
  it("should be able to register a user", async () => {
    const { user } = await registerUseCase.execute({
      email: "johndoe@email.com",
      name: "John Doe",
      password: "123456"
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should hash user password uppon register", async () => {
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

  it("should not be able to register with same email twice", async () => {
    await registerUseCase.execute({
      email: "johndoe@email.com",
      name: "John Doe",
      password: "123456"
    })

    expect(async () => {
      await registerUseCase.execute({
        email: "johndoe@email.com",
        name: "John Doe",
        password: "123456"
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})