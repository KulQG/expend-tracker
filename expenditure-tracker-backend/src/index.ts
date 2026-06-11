
import { createApp } from './app'
import { env } from './config/env'
import { prisma } from './db/prisma'

async function bootstrap() {
  await prisma.$connect()
  console.log('✅ Database connected')

  const app = createApp()

  const server = app.listen(env.port, () => {
    console.log(`🚀 Server running on http://localhost:${env.port}`)
  })

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`)
    server.close(async () => {
      await prisma.$disconnect()
      console.log('✅ Shutdown complete')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
