export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super("Max number of check-ins reached.")
  }
}

export class MaxDistanceReachedError extends Error {
  constructor() {
    super("Max distance reached.")
  }
}

export class MaxMinutesTimedOutError extends Error {
  constructor() {
    super("Max minutes timed out.")
  }
}

export class CheckInAlreadyValidatedError extends Error {
  constructor() {
    super("Check-in already validated.")
  }
}