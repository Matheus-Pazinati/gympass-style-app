import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticationUseCase } from './authentication'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authentication Use Case', () => {
  let inMemoryRepository: InMemoryUserRepository;
  let authenticationUseCase: AuthenticationUseCase;

  beforeEach(() => {
    inMemoryRepository = new InMemoryUserRepository()
    authenticationUseCase = new AuthenticationUseCase(inMemoryRepository)
  })

  it('should be able to authenticate user', async () => {
    inMemoryRepository.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash("123456", 6)
    })

    const { user } = await authenticationUseCase.execute({
       email: "johndoe@email.com",
       password: "123456"
    })

    expect(user.id).toEqual(expect.any(String))

  })

  it('should not be able to authenticate user with wrong email', async () => {
    expect(async () => {
      await authenticationUseCase.execute({
        email: "johndoe@email.com",
        password: "123456"
     })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)

  })

  it('should not be able to authenticate user with wrong password', async () => {
    inMemoryRepository.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash("123456", 6)
    })

    expect(async () => {
      await authenticationUseCase.execute({
        email: "johndoe@email.com",
        password: "123123"
     })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)

  })
})