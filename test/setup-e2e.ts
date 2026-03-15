import 'dotenv/config'

import { PrismaClient } from '../generated/prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaPg } from '@prisma/adapter-pg'

let prisma: PrismaClient

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provider a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL
  prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
    adapter: new PrismaPg({
      connectionString: databaseURL,
    }),
  })

  execSync(`yarn prisma migrate deploy`, {
    env: {
      ...process.env,
      DATABASE_URL: databaseURL,
    },
    stdio: 'inherit',
  })
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
