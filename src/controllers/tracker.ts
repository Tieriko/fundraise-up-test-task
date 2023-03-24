import {Context} from "koa"
import path from "path"
import fs from "fs"

import {TrackingDataSchema, ValidationError} from "../validation"
import {eventEmitter} from "../eventEmitter"

export async function handleTrackPost(ctx: Context) {
  try {
    const {events} = TrackingDataSchema.parse(ctx.request.body)

    eventEmitter.emit("saveEvents", events)

    ctx.status = 201
  } catch (error) {
    if (error instanceof ValidationError) {
      ctx.status = 422
      ctx.body = {
        error: "Bad Request",
        message: "Invalid data format",
        details: error.errors,
      }
    } else {
      ctx.status = 500
      ctx.body = {
        error: "Internal Server Error",
        message: "Failed to save data to MongoDB",
      }
    }
  }
}

export async function handleTrackerGet(ctx: Context) {
  try {
    const filePath = path.join(__dirname, "..", "..", "dist", "tracker.js")
    ctx.type = "application/javascript"
    ctx.body = fs.createReadStream(filePath)
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      error: "Internal Server Error",
      message: "Failed to serve the tracker script",
    }
  }
}
