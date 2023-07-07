import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";

describe("Search Gyms Use Case", () => {
  let gymRepository: InMemoryGymRepository
  let searchGymsUseCase: SearchGymsUseCase

  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymRepository)
  })

  it("should be able to search gyms by query", async () => {
    await gymRepository.create({
      name: "Javascript GYM",
      description: "The best GYM",
      latitude: 0,
      longitude: 0
    })

    await gymRepository.create({
      name: "Java GYM",
      description: "The biggest GYM",
      latitude: 0,
      longitude: 0
    })
    
    await gymRepository.create({
      name: "Typescript GYM",
      description: "The biggest GYM",
      latitude: 0,
      longitude: 0
    })

    const { gyms } = await searchGymsUseCase.execute({
      page: 1,
      query: "Java"
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({description: "The best GYM"}),
      expect.objectContaining({description: "The biggest GYM"}),
    ])
  })

  it("should be able to fetch paginated search gyms", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        name: `Typescript GYM ${i}`,
        description: "The biggest GYM",
        latitude: 0,
        longitude: 0
      })
    }
  
    const { gyms } = await searchGymsUseCase.execute({
      page: 2,
      query: "Typescript"
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({name: "Typescript GYM 21"}),
      expect.objectContaining({name: "Typescript GYM 22"}),
    ])
  })
})