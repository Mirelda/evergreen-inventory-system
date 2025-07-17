import { PrismaClient } from '@prisma/client'
import 'server-only'

// The `server-only` package prevents this code from being run on the client.

// React.cache is used to cache the Prisma Client instance.
// This is a new feature in React that helps with server-side rendering and data fetching.
// It ensures that we don't create a new Prisma Client instance on every request in development.
import { cache } from 'react'

const getPrismaClient = cache(() => {
  console.log('Creating a new Prisma Client instance')
  return new PrismaClient()
})

const prisma = getPrismaClient()

export default prisma
