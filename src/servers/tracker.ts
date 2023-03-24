import Koa from "koa"
import cors from "@koa/cors"
import logger from "koa-logger"
import bodyParser from "koa-bodyparser"
import getRawBody from "raw-body"

import trackerRouter from "../routers/tracker"

const trackerServer = new Koa()
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || []

const corsOptions: cors.Options = {
  origin: ctx => {
    const requestOrigin = ctx.origin
    if (allowedOrigins.includes(requestOrigin)) {
      return requestOrigin
    }
    return allowedOrigins[0]
  },
  allowMethods: ["GET", "POST"],
}

const parseTextPlain: Koa.Middleware = async (ctx, next) => {
  if (ctx.request.headers["content-type"] === "text/plain") {
    try {
      const buffer = await getRawBody(ctx.req)
      const json = JSON.parse(buffer.toString())
      ctx.request.body = json
    } catch (err) {
      ctx.throw(422, "Invalid JSON")
    }
  }
  await next()
}

trackerServer
  .use(logger())
  .use(cors(corsOptions))
  .use(parseTextPlain)
  .use(bodyParser({enableTypes: ["json", "text"]}))
  .use(trackerRouter.routes())
  .use(trackerRouter.allowedMethods())

export default trackerServer
