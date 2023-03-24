import request from "supertest"

import trackerServer from "./tracker"
import {eventEmitter} from "../eventEmitter"

const mockEvents = [
  {
    event: "click-link",
    tags: ["1"],
    url: "http://localhost:50000",
    title: "Example Page",
    ts: Date.now(),
  },
]

const incorrectEvents = [
  {
    event: "click-link",
    tags: 21,
    url: "localhost:5",
    ts: "Some invalid timestamp"
  },
]

jest.mock("../eventEmitter", () => {
  return {
    eventEmitter: {
      on: jest.fn(),
      emit: jest.fn(),
    },
  }
})

describe("Node.js App Routes", () => {
  test("POST /track – success with event fired", async () => {
    const res = await request(trackerServer.callback())
      .post("/track")
      .send({events: mockEvents})
      .set("Content-Type", "application/json")
      .set("Origin", "http://localhost:50000")

    expect(res.status).toBe(201)

    expect(eventEmitter.emit).toHaveBeenCalledTimes(1)
    expect(eventEmitter.emit).toHaveBeenCalledWith("saveEvents", mockEvents)
  })

  test("POST /track – fail with 422", async () => {
    const res = await request(trackerServer.callback())
      .post("/track")
      .send({events: incorrectEvents})
      .set("Content-Type", "application/json")
      .set("Origin", "http://localhost:50000")

    expect(res.status).toBe(422)
  })

  test("GET /tracker", async () => {
    const res = await request(trackerServer.callback()).get("/tracker")
    expect(res.status).toBe(200)
    expect(res.type).toBe("application/javascript")
  })
})
