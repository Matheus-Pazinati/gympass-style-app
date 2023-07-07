import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics";

describe("Get User Metrics Use Case", () => {
  let checkinRepository: InMemoryCheckInRepository;
  let getUserMetricsUseCase: GetUserMetricsUseCase;

  beforeEach(async () => {
    checkinRepository = new InMemoryCheckInRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkinRepository)
  })

  it("should be able to get user metrics", async () => {
    await checkinRepository.create({
      gym_id: "gym-01",
      user_id: "user-01"
    })

    await checkinRepository.create({
      gym_id: "gym-02",
      user_id: "user-01"
    })

    const { userCheckinsAmount } = await getUserMetricsUseCase.execute({
      userId: "user-01"
    })

    expect(userCheckinsAmount).toBe(2)
  })
})