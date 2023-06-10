import { prisma } from "@/lib/prisma"
import { UserRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUserCaseParams {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UserRepository) {}
  
  async execute({
    email, name, password
  }: RegisterUserCaseParams) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
  
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
  
    const password_hash = await hash(password, 6)
  
    this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}