import {Event} from "../validation"

const ENDPOINT = "http://localhost:8888/track"
const DEBOUNCE_DELAY = 1000;
interface ITracker {
  track(event: string, ...tags: string[]): void;
}
export class Tracker implements ITracker {
  private buffer: Event[] = []
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint

    if (typeof window !== "undefined") {
      const globalThis = window as any
      const isScheduledQueueExist = globalThis.tracker && Array.isArray(globalThis.tracker.q)

      const scheduledQueue = isScheduledQueueExist ? globalThis.tracker.q : []
      this.processQueue(scheduledQueue)

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.flushBuffer(true)
        }
      })
    }
  }

  public processQueue(scheduledQueue: Event[]): void {
    this.buffer = [...this.buffer, ...scheduledQueue]
    this.scheduleSending()
  }

  public track(event: string, ...tags: string[]): void {
    const newEvent: Event = {
      event,
      tags,
      url: window.location.href,
      title: document.title,
      ts: Date.now(),
    }

    this.buffer.push(newEvent)
    this.scheduleSending()
  }

  private sendEvents(buffer: Event[]): void {
    this.flushBuffer().catch(error => {
      console.error("Failed to send events:", error)

      setTimeout(() => {
        this.buffer.push(...buffer)
        this.scheduleSending()
      }, DEBOUNCE_DELAY)
    })
  }
  private scheduleSending(): void {
    const buffer = [...this.buffer]

    if (buffer.length >= 3) {
      this.sendEvents(buffer)
      return;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      const isSecondPass = Date.now() - buffer[0].ts >= DEBOUNCE_DELAY

      if (buffer.length > 0 && isSecondPass) {
        this.sendEvents(buffer)
      } else {
        this.scheduleSending()
      }
    }, DEBOUNCE_DELAY)
  }

  private async flushBuffer(keepAlive = false): Promise<void> {
    if (this.buffer.length === 0) {
      return
    }

    const eventsToSend = this.buffer
    this.buffer = []

    const contentType = "text/plain"
    const request = {events: eventsToSend}

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
        },
        body: JSON.stringify(request),
        keepalive: keepAlive,
      })
    } catch (fetchError) {
      if (keepAlive && "navigator" in window && "sendBeacon" in navigator) {
        const blob = new Blob([JSON.stringify(request)])

        if (!navigator.sendBeacon(this.endpoint, blob)) {
          throw new Error("Failed to send events with sendBeacon")
        }
      } else {
        throw fetchError
      }
    }
  }
}

(window as any).tracker = new Tracker(ENDPOINT)
