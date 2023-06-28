import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

describe('Check-In Use Case', () => {
  let inMemoryRepository: InMemoryCheckInRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInRepository()
    checkInUseCase = new CheckInUseCase(inMemoryRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a check-in', async () => {
    const { checkIn } = await checkInUseCase.execute({
       gymId: "gym-1",
       userId: "user-1"
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to create twice check-ins in the same day', async () => {
    const date = new Date(2023, 0, 20, 5, 0, 0)
    vi.setSystemTime(date)

    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1'
    })

    await expect(() => 
      checkInUseCase.execute({
        gymId: 'gym-1',
        userId: 'user-1'
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})