import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Get User Profile Use Case', () => {
  let inMemoryRepository: InMemoryUserRepository;
  let getUserProfileUseCase: GetUserProfileUseCase;

  beforeEach(() => {
    inMemoryRepository = new InMemoryUserRepository()
    getUserProfileUseCase= new GetUserProfileUseCase(inMemoryRepository)
  })

  it('should be able to get user profile', async () => {
    const newUser = inMemoryRepository.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash("123456", 6)
    })

    const { user } = await getUserProfileUseCase.execute({
       userId: (await newUser).id
    })

    expect(user.name).toEqual("John Doe")

  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(async () => {
      await getUserProfileUseCase.execute({
        userId: 'non-existing id'
     })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})