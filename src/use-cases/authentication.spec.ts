import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it } from 'vitest'
import { AuthenticationUseCase } from './authentication'
import { hash } from 'bcryptjs'

describe('Authentication Use Case', () => {
  it('should be able to authenticate user', async () => {
    const inMemoryRepository = new InMemoryUserRepository()
    const authenticationUseCase = new AuthenticationUseCase(inMemoryRepository)


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
})