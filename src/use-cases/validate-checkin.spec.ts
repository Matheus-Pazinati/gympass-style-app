import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { ValidateCheckInUseCase } from "./validate-checkin";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

describe("Validate Check-In Use Case", () => {
  let checkInRepository: InMemoryCheckInRepository
  let validateCheckinUseCase: ValidateCheckInUseCase

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    validateCheckinUseCase = new ValidateCheckInUseCase(checkInRepository)
  })
  it("should be able to validate a check-in", async () => {
    const newCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01"
    })

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
})