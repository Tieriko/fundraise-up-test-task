import Router from "koa-router"
import {handleTrackPost, handleTrackerGet} from "../controllers/tracker"

const trackerRouter = new Router()

trackerRouter.post("/track", handleTrackPost)
trackerRouter.get("/tracker", handleTrackerGet)

export default trackerRouter
