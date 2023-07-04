import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { describe, it, expect, beforeEach } from "vitest";
import { CreateGymUseCase } from "./create-gym";

describe("Create Gym Use Case", () => {
  let inMemoryRepository: InMemoryGymRepository;
  let gymUseCase: CreateGymUseCase;

  beforeEach(async () => {
    inMemoryRepository = new InMemoryGymRepository()
    gymUseCase = new CreateGymUseCase(inMemoryRepository)
  })

  it("should be able to create a gym", async () => {
    const { gym } = await gymUseCase.execute({
      name: "Javascript GYM",
      description: null,
      latitude: -22.5688278,
      longitude: -48.6357383,
      phone: null
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})