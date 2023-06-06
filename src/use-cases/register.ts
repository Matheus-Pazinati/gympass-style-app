import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

interface RegisterUserCaseParams {
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({
  email, name, password
}: RegisterUserCaseParams) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if (userWithSameEmail) {
    throw new Error("This e-mail already exists.")
  }

  const password_hash = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash
    }
  })
}