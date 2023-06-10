import { prisma } from "@/lib/prisma"
import { UserRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs"

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
      throw new Error("This e-mail already exists.")
    }
  
    const password_hash = await hash(password, 6)
  
    this.usersRepository.create({
      name,
      email,
      password_hash
    })
  }
}