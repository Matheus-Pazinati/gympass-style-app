export class UserAlreadyExistsError extends Error {
  constructor() {
    super("This e-mail already exists.")
  }
}