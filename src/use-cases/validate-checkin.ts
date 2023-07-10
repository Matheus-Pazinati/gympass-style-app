import { CheckInRepository } from "@/repositories/checkin-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { MaxMinutesTimedOutError } from "./errors/checkin-errors";

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    checkInId
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const checkInValidateDate = dayjs(new Date)
    const minutesPassedAfterCreatingCheckIn = checkInValidateDate.diff(
      checkIn.created_at,
      "minute"
    )
    const maxTimeForCheckInValidationInMinutes = 20;
    
    if (minutesPassedAfterCreatingCheckIn > maxTimeForCheckInValidationInMinutes) {
      throw new MaxMinutesTimedOutError()
    }

    checkIn.validated_at = new Date()

    await this.checkInRepository.save(checkIn)

    return {
      checkIn
    }
  }
}