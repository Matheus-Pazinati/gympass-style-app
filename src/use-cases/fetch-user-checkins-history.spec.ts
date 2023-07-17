import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-checkins-history";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

describe("Fetch User Check Ins History Use Case", () => {
  let checkinRepository: InMemoryCheckInRepository
  let FetchUserCheckInHistoryUseCase: FetchUserCheckInsHistoryUseCase

  beforeEach(async () => {
    checkinRepository = new InMemoryCheckInRepository()
    FetchUserCheckInHistoryUseCase = new FetchUserCheckInsHistoryUseCase(checkinRepository)
  })

  it("should be able to fetch user check ins history", async () => {
    await checkinRepository.create({
      gym_id: "gym-01",
      user_id: "user-01"
    })

    await checkinRepository.create({
      gym_id: "gym-02",
      user_id: "user-01"
    })

    const { userCheckIns } = await FetchUserCheckInHistoryUseCase.execute({
      userId: "user-01",
      page: 1
    })

    expect(userCheckIns).toHaveLength(2)
    expect(userCheckIns).toEqual([
      expect.objectContaining({
        gym_id: "gym-01"
      }),
      expect.objectContaining({
        gym_id: "gym-02"
      }),
    ])
  })

  it("should be able to fetch paginated user check ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkinRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01"
      })
    }

    const { userCheckIns } = await FetchUserCheckInHistoryUseCase.execute({
      userId: "user-01",
      page: 2
    })

    expect(userCheckIns).toHaveLength(2)
    expect(userCheckIns).toEqual([
      expect.objectContaining({
        gym_id: "gym-21"
      }),
      expect.objectContaining({
        gym_id: "gym-22"
      }),
    ])
  })
})