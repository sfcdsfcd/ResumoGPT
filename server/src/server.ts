import { createApp } from './app'
import { env } from './config/env'
import { initDb } from './db'

async function start() {
  await initDb()
  const app = createApp()
  const PORT = parseInt(env.port, 10)
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
