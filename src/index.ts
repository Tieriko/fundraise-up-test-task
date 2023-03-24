import dotenv from "dotenv"
import {PrismaClient} from "@prisma/client"

import {Event} from "./validation"
import {eventEmitter} from "./eventEmitter"
import env from "./env"
import trackerServer from "./servers/tracker"
import htmlServer from "./servers/html"

dotenv.config()
const prisma = new PrismaClient()

eventEmitter.on("saveEvents", async (events: Event[]) => {
  try {
    console.log("saving events")
    await prisma.trackingEvent.createMany({
      data: events,
    })
  } catch (error) {
    console.error("Failed to save data to the database:", error)
  }
})

async function handleExit(signal: NodeJS.Signals) {
  console.log(`Received ${signal}, closing Prisma connection...`)
  await prisma.$disconnect()
  process.exit(0)
}

process.on("SIGINT", handleExit)
process.on("SIGTERM", handleExit)

trackerServer.listen(env.dataPort, () => {
  console.log("Tracker server listening on http://localhost:8888")
})

htmlServer.listen(env.htmlPort, () => {
  console.log("HTML server listening on http://localhost:50000")
})
