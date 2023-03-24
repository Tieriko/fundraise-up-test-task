import {z} from "zod"

export const EventSchema = z.object({
  event: z.string(),
  tags: z.array(z.string()),
  url: z.string().url(),
  title: z.string(),
  ts: z.number().int(),
})

export type Event = z.infer<typeof EventSchema>

export const ValidationError = z.ZodError
export const TrackingDataSchema = z.object({
  events: z.array(EventSchema)
})
