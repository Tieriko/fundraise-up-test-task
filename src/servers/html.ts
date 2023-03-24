import Koa from "koa"
import logger from "koa-logger"
import serve from "koa-static"
import send from "koa-send"

export const HTML_PATHS = ["/", "/1.html", "/2.html", "/3.html"]

const htmlServer = new Koa()

htmlServer
  .use(logger())
  .use(serve("public"))
  .use(async (ctx, next) => {
    if (HTML_PATHS.includes(ctx.path)) {
      await send(ctx, "public/index.html")
    } else {
      await next()
    }
  })

export default htmlServer
