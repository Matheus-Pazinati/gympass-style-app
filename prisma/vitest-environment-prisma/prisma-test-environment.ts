import "dotenv/config"
import { randomUUID } from "node:crypto"
import { execSync } from 'node:child_process'
import type { Environment } from "vitest"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function createTestDatabaseURL(schema: string) {
  const databaseURL = process.env.DATABASE_URL
  if (!databaseURL) {
    throw new Error("Set a DATABASE_URL environment variable")
  }

  const url = new URL(databaseURL)
  url.searchParams.set("schema", schema)

  return url.toString()
} 

export default <Environment> {
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const testDatabaseURL = createTestDatabaseURL(schema)
    process.env.DATABASE_URL = testDatabaseURL

    execSync("npx prisma migrate deploy")

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await prisma.$disconnect()
      }
    }
  },
}