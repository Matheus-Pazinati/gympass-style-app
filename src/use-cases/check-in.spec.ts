import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

describe('Check-In Use Case', () => {
  let inMemoryRepository: InMemoryCheckInRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInRepository()
    checkInUseCase = new CheckInUseCase(inMemoryRepository)
  })

  it('should be able to create a check-in', async () => {
    const { checkIn } = await checkInUseCase.execute({
       gymId: "gym-1",
       userId: "user-1"
    })

    expect(checkIn.id).toEqual(expect.any(String))

  })
})