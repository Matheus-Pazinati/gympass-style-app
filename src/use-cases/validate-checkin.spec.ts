import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInUseCase } from "./validate-checkin";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { MaxMinutesTimedOutError } from "./errors/checkin-errors";

describe("Validate Check-In Use Case", () => {
  let checkInRepository: InMemoryCheckInRepository
  let validateCheckinUseCase: ValidateCheckInUseCase

  beforeEach(async () => {
    vi.useFakeTimers()
    checkInRepository = new InMemoryCheckInRepository()
    validateCheckinUseCase = new ValidateCheckInUseCase(checkInRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to validate a check-in", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 15, 0))
    
    const newCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01"
    })

    const nineteenMinutesInMilliseconds = 1000 * 60 * 19
    vi.advanceTimersByTime(nineteenMinutesInMilliseconds)

    const { checkIn } = await validateCheckinUseCase.execute({
      checkInId: newCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it("should not be able to validated an nonexistent check-in", async () => {
    await expect(() => 
      validateCheckinUseCase.execute({
        checkInId: "nonexistent-id"
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it("should not be able to validated a check-in after twenty minutes of his creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 15, 0))

    const newCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01"
    })

    const twentyOneMinutesInMilliseconds = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMilliseconds)

    await expect(() => 
      validateCheckinUseCase.execute({
        checkInId: newCheckIn.id
      })
    ).rejects.toBeInstanceOf(MaxMinutesTimedOutError)
  })
})