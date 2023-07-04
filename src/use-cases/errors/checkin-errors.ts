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