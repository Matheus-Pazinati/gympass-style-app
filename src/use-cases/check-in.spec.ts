import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { MaxDistanceReachedError, MaxNumberOfCheckInsError } from './errors/checkin-errors';

describe('Check-In Use Case', () => {
  let inMemoryRepository: InMemoryCheckInRepository;
  let inMemoryGymRepository: InMemoryGymRepository;
  let checkInUseCase: CheckInUseCase;

  beforeEach(async () => {
    inMemoryRepository = new InMemoryCheckInRepository()
    inMemoryGymRepository = new InMemoryGymRepository()
    checkInUseCase = new CheckInUseCase(inMemoryRepository, inMemoryGymRepository)

    await inMemoryGymRepository.create({
      name: "Javascript GYM",
      id: "gym-1",
      description: "Best GYM",
      latitude: -22.5688278,
      longitude: -48.6357383,
      phone: "997452321"
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to create a check-in', async () => {
    const { checkIn } = await checkInUseCase.execute({
       gymId: 'gym-1',
       userId: 'user-1',
       userLatitute: -22.5688278,
       userLongitude: -48.6357383
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to create twice check-ins in the same day', async () => {
    const date = new Date(2023, 0, 20, 5, 0, 0)
    vi.setSystemTime(date)

    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitute: -22.5688278,
      userLongitude: -48.6357383
    })

    await expect(() => 
      checkInUseCase.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitute: -22.5688278,
        userLongitude: -48.6357383
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to create check-ins in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 5, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitute: -22.5688278,
      userLongitude: -48.6357383
    })

    vi.setSystemTime(new Date(2023, 0, 21, 5, 0, 0))
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitute: -22.5688278,
      userLongitude: -48.6357383
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in on a distant gym', async () => {
    inMemoryGymRepository.create({
      name: "Javascript GYM",
      id: "gym-2",
      description: "",
      latitude: -21.0170601,
      longitude: -45.0309648,
      phone: ""
    })

    await expect(() => 
     checkInUseCase.execute({
      gymId: 'gym-2',
      userId: 'user-1',
      userLatitute: -22.5688278,
      userLongitude: -48.6357383
    })
   ).rejects.toBeInstanceOf(MaxDistanceReachedError)
  })
})