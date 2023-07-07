import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

describe("Fetch Nearby Gyms Use Case", () => {
  let gymRepository: InMemoryGymRepository
  let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

  beforeEach(async () => {
    gymRepository = new InMemoryGymRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymRepository)
  })

  it("should be able to fetch only nearby gyms", async () => {
    gymRepository.create({
      name: "Nearby Gym",
      latitude: -22.5688278,
      longitude: -48.6357383,
    })

    gymRepository.create({
      name: "Far Gym",
      latitude: -19.3582656,
      longitude: -49.1191367,
    })

    const { nearbyGyms } = await fetchNearbyGymsUseCase.execute({
      page: 1,
      userLatitude: -22.5688278,
      userLongitude: -48.6357383
    })

    expect(nearbyGyms).toHaveLength(1)
    expect(nearbyGyms).toEqual([
      expect.objectContaining({name: "Nearby Gym"})
    ])
  })

  it("should be able to fetch paginated nearby gyms", async () => {
    for (let i = 1; i <= 22; i++) {
      gymRepository.create({
        name: `Nearby Gym ${i}`,
        latitude: -22.5688278,
        longitude: -48.6357383,
      })
    }

    const { nearbyGyms } = await fetchNearbyGymsUseCase.execute({
      page: 2,
      userLatitude: -22.5688278,
      userLongitude: -48.6357383
    })

    expect(nearbyGyms).toHaveLength(2)
    expect(nearbyGyms).toEqual([
      expect.objectContaining({name: "Nearby Gym 21"}),
      expect.objectContaining({name: "Nearby Gym 22"})
    ])

  })
})