import {Tracker} from "./tracker"
import {Event} from "../validation"

const TEST_ENDPOINT = "http://localhost:8888/track"
const ORIGINAL_FETCH = global.fetch

describe("Tracker", () => {
  let tracker: Tracker
  let fetchMock: jest.Mock

  beforeEach(() => {
    fetchMock = jest.fn()
    global.fetch = fetchMock as any
    tracker = new Tracker(TEST_ENDPOINT)
  })

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH
  })

  it("should send a single event", async () => {
    const event: Event = {
      event: "exampleEvent",
      tags: ["tag1", "tag2"],
      url: "https://example.com",
      title: "Example Title",
      ts: Date.now(),
    }

    tracker.track(event.event, ...event.tags)

    setTimeout(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(TEST_ENDPOINT, expect.objectContaining({
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({events: [event]}),
      }))
    }, 1100)
  })
})
