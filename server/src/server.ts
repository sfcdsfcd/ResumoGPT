import "reflect-metadata"
import { createApp } from './app'
import { env } from './config/env'
import { initDb } from './db'
import { setupDi } from './di'

async function start() {
  setupDi()
  await initDb()
  const app = createApp()
  const PORT = parseInt(env.port, 10)
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
