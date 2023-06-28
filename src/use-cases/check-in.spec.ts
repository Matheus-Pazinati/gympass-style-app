import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { Decimal } from '@prisma/client/runtime/library';

describe('Check-In Use Case', () => {
  let inMemoryRepository: InMemoryCheckInRepository;
  let inMemoryGymRepository: InMemoryGymRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInRepository()
    inMemoryGymRepository = new InMemoryGymRepository()
    checkInUseCase = new CheckInUseCase(inMemoryRepository, inMemoryGymRepository)

    inMemoryGymRepository.items.push({
      name: "Javascript GYM",
      id: "gym-1",
      description: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: ""
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a check-in', async () => {
    const { checkIn } = await checkInUseCase.execute({
       gymId: "gym-1",
       userId: "user-1",
       latitute: -22.5688278,
       longitude: -48.6357383
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to create twice check-ins in the same day', async () => {
    const date = new Date(2023, 0, 20, 5, 0, 0)
    vi.setSystemTime(date)

    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      latitute: -22.5688278,
      longitude: -48.6357383
    })

    await expect(() => 
      checkInUseCase.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        latitute: -22.5688278,
        longitude: -48.6357383
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to create check-ins in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 5, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      latitute: -22.5688278,
      longitude: -48.6357383
    })

    vi.setSystemTime(new Date(2023, 0, 21, 5, 0, 0))
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      latitute: -22.5688278,
      longitude: -48.6357383
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})